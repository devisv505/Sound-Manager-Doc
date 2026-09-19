using System;
using DEV505.SoundManager;
using UnityEngine;

public sealed class EngineSoundControls : MonoBehaviour
{
    [SerializeField, Range(0f, 1f)] private float rpm = 0f;
    private SoundHandle engine;
    private IDisposable subscription;

    private void OnEnable()
    {
        subscription = SoundBus.Notifications.Subscribe(OnSoundChanged);
    }

    private void Start() => StartEngine();

    [ContextMenu("Start engine")]
    public void StartEngine()
    {
        if (!Application.isPlaying || !isActiveAndEnabled || SoundBus.IsAlive(engine))
            return;

        var service = SoundServices.Current;
        if (service == null)
        {
            Debug.LogWarning("Add an active Sound Manager to the scene.", this);
            return;
        }

        var context = SoundPlayContext.Following(transform, service.OwnerOf(gameObject))
            .With(SoundParameters.Engine.Rpm, rpm)
            .With(SoundParameters.Engine.Load, 0.2f);
        var result = SoundBus.Play(Sounds.Engine, context);
        if (result.Accepted)
            engine = result.Handle;
        else
            Debug.LogWarning($"Could not start Engine: {result.Status}", this);
    }

    private void Update()
    {
        if (SoundBus.IsAlive(engine))
            SoundBus.SetFloat(engine, SoundParameters.Engine.Rpm, rpm);
    }

    [ContextMenu("Sound horn")]
    public void SoundHorn()
    {
        if (SoundBus.IsAlive(engine))
            SoundBus.SendSignal(engine, "Horn");
    }

    [ContextMenu("Pause engine")]
    public void PauseEngine() => SoundBus.SetPaused(engine, true);

    [ContextMenu("Resume engine")]
    public void ResumeEngine() => SoundBus.SetPaused(engine, false);

    [ContextMenu("Stop engine")]
    public void StopEngine()
    {
        if (SoundBus.IsAlive(engine))
            SoundBus.Stop(engine);
        // Keep the handle until the ending notification so it can be identified.
    }

    private void OnSoundChanged(SoundNotification message)
    {
        if (!message.Handle.Equals(engine) || !message.IsTerminal)
            return;
        Debug.Log($"Engine ended: {message.Kind} ({message.Reason})", this);
        engine = default;
    }

    private void OnDisable()
    {
        subscription?.Dispose();
        subscription = null;
        StopEngine();
        engine = default;
    }
}
