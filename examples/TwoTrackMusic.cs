using DEV505.SoundManager;
using UnityEngine;

public sealed class TwoTrackMusic : MonoBehaviour
{
    [SerializeField] private AudioClip firstTrack = null;
    [SerializeField] private AudioClip secondTrack = null;
    [SerializeField, Range(0, 1)] private float volume = 0.65f;
    private ISoundService service;
    private SoundOwnerToken owner;
    private SoundHandle current;
    private SoundHandle outgoing;
    private AudioClip currentClip;
    private bool paused;

    [ContextMenu("Play first track")]
    public void PlayFirst() => Select(firstTrack);
    [ContextMenu("Play second track")]
    public void PlaySecond() => Select(secondTrack);

    public void Select(AudioClip clip)
    {
        if (!Application.isPlaying || !isActiveAndEnabled || !clip || paused) return;
        var active = SoundServices.Current;
        if (active == null || !active.Ready) return;
        if (!ReferenceEquals(service, active))
        {
            current = outgoing = default;
            service = active;
            owner = service.OwnerOf(this);
        }
        if (current.IsAlive() && currentClip == clip) return;
        if (outgoing.IsAlive())
        {
            Debug.Log("Wait for the current crossfade to finish before choosing again.", this);
            return;
        }
        var context = SoundPlayContext.At(transform.position, owner)
            .With(SoundParameters.Jukebox.Track, clip)
            .With(SoundParameters.Jukebox.Gain, 0f)
            .With(SoundParameters.Jukebox.Volume, volume);
        var result = SoundBus.Play(Sounds.Jukebox, context);
        if (!result.Accepted)
        {
            Debug.LogWarning($"Track could not start: {result.Status}", this);
            return; // Keep the current track if the new request failed.
        }
        outgoing = current;
        current = result.Handle;
        currentClip = clip;
        if (outgoing.IsAlive()) SoundBus.SetFloat(outgoing, SoundParameters.Jukebox.Gain, 0);
        SoundBus.SetFloat(current, SoundParameters.Jukebox.Gain, 1);
    }

    private void Update()
    {
        if (current.IsAlive()) SoundBus.SetFloat(current, SoundParameters.Jukebox.Volume, volume);
        if (outgoing.IsAlive()) SoundBus.SetFloat(outgoing, SoundParameters.Jukebox.Volume, volume);
        if (paused || !ReferenceEquals(service, SoundServices.Current)) return;
        if (outgoing.IsAlive() && service.TryGetParameter(outgoing, SoundParameters.Jukebox.Gain, out var gain)
            && gain.Current.number <= 0.001f)
        {
            SoundBus.Stop(outgoing, 0); // The graph has already faded this play to silence.
            outgoing = default;
        }
    }

    public void SetPaused(bool value)
    {
        paused = value;
        SoundBus.SetPaused(current, value);
        SoundBus.SetPaused(outgoing, value);
    }
    [ContextMenu("Pause both tracks")]
    public void PauseMusic() => SetPaused(true);
    [ContextMenu("Resume both tracks")]
    public void ResumeMusic() => SetPaused(false);

    [ContextMenu("Stop music now")]
    public void StopMusic()
    {
        if (ReferenceEquals(service, SoundServices.Current) && owner.IsValid)
            service.StopOwned(owner, 0);
        current = outgoing = default;
        currentClip = null;
        paused = false;
    }

    private void OnDisable()
    {
        StopMusic();
        if (ReferenceEquals(service, SoundServices.Current) && owner.IsValid)
            service.ReleaseOwner(owner);
        owner = default;
        service = null;
    }
}
