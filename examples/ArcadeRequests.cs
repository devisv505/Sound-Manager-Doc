using System;
using DEV505.SoundManager;
using UnityEngine;

public sealed class ArcadeRequests : MonoBehaviour
{
    private ISoundService service;
    private SoundOwnerToken owner;
    private IDisposable subscription;
    public SoundPlayStatus LastStatus { get; private set; }
    public int Replacements { get; private set; }

    private void OnEnable() => subscription = SoundBus.Notifications.Subscribe(OnSoundChanged);

    public SoundPlayResult Request(SoundKey key)
    {
        if (!Application.isPlaying || !isActiveAndEnabled)
            return new SoundPlayResult(SoundPlayStatus.NotReady);
        service = SoundServices.Current;
        if (service == null || !service.Ready)
            return new SoundPlayResult(SoundPlayStatus.NotReady);
        owner = service.OwnerOf(this);
        var result = SoundBus.Play(key, SoundPlayContext.Following(transform, owner));
        LastStatus = result.Status;
        if (!result.Accepted)
        {
            // These refusals are expected under load. Do not retry every frame.
            if (result.Status == SoundPlayStatus.Cooldown) Debug.Log("Wait before the next jackpot.", this);
            else if (result.Status == SoundPlayStatus.ConcurrencyLimit || result.Status == SoundPlayStatus.CapacityExceeded)
                Debug.Log("All permitted plays or voices are busy; skip this request.", this);
            else Debug.LogWarning($"Sound could not play: {result.Status}", this);
        }
        return result;
    }

    [ContextMenu("Zap")]
    public void Zap() => Request(Sounds.ArcadeZap);
    [ContextMenu("Coin")]
    public void Coin() => Request(Sounds.ArcadeCoin);
    [ContextMenu("Jackpot")]
    public void Jackpot() => Request(Sounds.ArcadeJackpot);

    private void OnSoundChanged(SoundNotification message)
    {
        if (!owner.IsValid || !message.Owner.Equals(owner)) return;
        if (message.Kind == SoundNotificationKind.Cancelled && message.Reason == SoundPlayStatus.ConcurrencyLimit)
            Replacements++;
        if (message.Kind == SoundNotificationKind.Failed)
            Debug.LogWarning($"An accepted play later failed: {message.Reason}", this);
    }

    private void OnDisable()
    {
        subscription?.Dispose();
        subscription = null;
        if (ReferenceEquals(service, SoundServices.Current) && owner.IsValid)
        {
            service.StopOwned(owner, 0);
            service.ReleaseOwner(owner);
        }
        owner = default;
        service = null;
    }
}
