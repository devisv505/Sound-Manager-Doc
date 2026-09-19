using System;
using DEV505.SoundManager;
using UnityEngine;

public sealed class LaunchAfterSound : MonoBehaviour
{
    [SerializeField] private Transform rocket = null;
    [SerializeField, Range(0, 1)] private float power = 0f;
    [SerializeField, Range(0, 1)] private float pressure = 0f;
    [SerializeField] private bool clampsOpen = false;
    private SoundHandle sequence;
    private SoundHandle flight;
    private IDisposable subscription;
    private bool launchPending;
    public bool HasLaunched { get; private set; }

    private void OnEnable() => subscription = SoundBus.Notifications.Subscribe(OnSoundChanged);

    [ContextMenu("Begin waiting for clearance")]
    public void Begin()
    {
        if (!Application.isPlaying || !isActiveAndEnabled || sequence.IsAlive() || flight.IsAlive()) return;
        var service = SoundServices.Current;
        if (service == null || !service.Ready || !rocket) return;
        launchPending = false;
        HasLaunched = false;
        var context = SoundPlayContext.At(transform.position, service.OwnerOf(this))
            .With(SoundParameters.LaunchSequence.Power, power)
            .With(SoundParameters.LaunchSequence.Pressure, pressure)
            .With(SoundParameters.LaunchSequence.ClampsOpen, clampsOpen);
        var result = SoundBus.Play(Sounds.LaunchSequence, context);
        if (result.Accepted) sequence = result.Handle;
        else Debug.LogWarning($"Countdown could not start: {result.Status}", this);
    }

    private void Update()
    {
        if (sequence.IsAlive())
        {
            SoundBus.SetFloat(sequence, SoundParameters.LaunchSequence.Power, power);
            SoundBus.SetFloat(sequence, SoundParameters.LaunchSequence.Pressure, pressure);
            SoundBus.SetParameter(sequence, SoundParameters.LaunchSequence.ClampsOpen, SoundValue.Bool(clampsOpen));
        }
        var service = SoundServices.Current;
        if (!launchPending || service == null || service.Paused || !rocket) return;
        launchPending = false;
        sequence = default;
        var context = SoundPlayContext.Following(rocket, service.OwnerOf(rocket.gameObject))
            .With(SoundParameters.LaunchFlight.Thrust, 1f);
        var result = SoundBus.Play(Sounds.LaunchFlight, context);
        if (result.Accepted)
        {
            flight = result.Handle;
            HasLaunched = true;
            // Start your rocket movement here. Following updates audio position as you move it.
        }
        else Debug.LogWarning($"Flight could not start: {result.Status}", this);
    }

    private void OnSoundChanged(SoundNotification message)
    {
        if (!message.Handle.Equals(sequence)) return;
        if (message.Kind == SoundNotificationKind.Finished) launchPending = true;
        else if (message.IsTerminal)
        {
            sequence = default;
            launchPending = false;
        }
    }

    [ContextMenu("Cancel and stop")]
    public void Cancel()
    {
        launchPending = false;
        var oldSequence = sequence;
        sequence = default; // Its later Cancelled notification cannot start a launch.
        SoundBus.Stop(oldSequence, 0);
        SoundBus.Stop(flight, 0);
        flight = default;
        HasLaunched = false;
    }

    private void OnDisable()
    {
        subscription?.Dispose();
        subscription = null;
        Cancel();
    }
}
