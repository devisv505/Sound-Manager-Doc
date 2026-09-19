using DEV505.SoundManager;
using UnityEngine;

public sealed class WorkshopSounds : MonoBehaviour
{
    [SerializeField, Range(0, 1)] private float pace = 0.5f;
    [SerializeField] private Transform hammerPoint = null;
    private ISoundService service;
    private SoundOwnerToken owner;
    private SoundHandle session;
    private SoundHandle taps;
    private int tool;

    private bool Ready()
    {
        if (!Application.isPlaying || !isActiveAndEnabled) return false;
        var active = SoundServices.Current;
        if (active == null || !active.Ready) return false;
        if (!ReferenceEquals(service, active))
        {
            session = default;
            taps = default;
            service = active;
            owner = service.OwnerOf(this);
        }
        return true;
    }

    private SoundHandle StartSession(Transform point, int selectedTool)
    {
        var context = SoundPlayContext.Following(point, owner)
            .With(SoundParameters.Workshop.Tool, selectedTool)
            .With(SoundParameters.Workshop.Pace, pace);
        var result = SoundBus.Play(Sounds.Workshop, context);
        if (!result.Accepted) Debug.LogWarning($"Workshop could not start: {result.Status}", this);
        return result.Handle;
    }

    public void Work(int selectedTool)
    {
        if (!Ready()) return;
        tool = Mathf.Clamp(selectedTool, 0, 2);
        if (!session.IsAlive()) session = StartSession(transform, tool);
        if (!session.IsAlive()) return;
        SoundBus.SetParameter(session, SoundParameters.Workshop.Tool, SoundValue.Int(tool));
        SoundBus.SendSignal(session, "Work");
    }

    [ContextMenu("Work with hammer")]
    public void Hammer() => Work(0);
    [ContextMenu("Work with handsaw")]
    public void Saw() => Work(1);
    [ContextMenu("Work with drill")]
    public void Drill() => Work(2);

    [ContextMenu("One hammer impact")]
    public void Strike()
    {
        if (!Ready()) return;
        if (tool == 0)
        {
            if (!session.IsAlive()) session = StartSession(transform, 0);
            SoundBus.SendSignal(session, "Strike");
        }
        else
        {
            if (!taps.IsAlive()) taps = StartSession(hammerPoint ? hammerPoint : transform, 0);
            SoundBus.SendSignal(taps, "Strike");
        }
        // In a game, call Strike at the animation's contact frame.
    }

    [ContextMenu("Take a break")]
    public void TakeBreak()
    {
        SoundBus.SendSignal(session, "Pause");
        SoundBus.SendSignal(taps, "Pause");
        // Keep Alive leaves both sessions available for the next Work or Strike.
    }

    private void Update()
    {
        if (session.IsAlive()) SoundBus.SetFloat(session, SoundParameters.Workshop.Pace, pace);
    }

    private void OnDisable()
    {
        if (ReferenceEquals(service, SoundServices.Current) && owner.IsValid)
        {
            service.StopOwned(owner, 0);
            service.ReleaseOwner(owner);
        }
        session = taps = default;
        owner = default;
        service = null;
    }
}
