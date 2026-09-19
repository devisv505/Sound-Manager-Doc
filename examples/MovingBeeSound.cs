using DEV505.SoundManager;
using UnityEngine;

public sealed class MovingBeeSound : MonoBehaviour
{
    [SerializeField] private Transform bee = null;
    [SerializeField, Range(0.7f, 1.5f)] private float wingSpeed = 1f;
    private SoundHandle buzzing;

    private void Start() => BeginBuzzing();

    [ContextMenu("Begin buzzing")]
    public void BeginBuzzing()
    {
        if (!Application.isPlaying || !isActiveAndEnabled || SoundBus.IsAlive(buzzing))
            return;

        var service = SoundServices.Current;
        if (service == null)
        {
            Debug.LogWarning("Add an active Sound Manager to the scene.", this);
            return;
        }

        var target = bee != null ? bee : transform;
        var owner = service.OwnerOf(gameObject);
        var context = SoundPlayContext.Following(target, owner)
            .With(SoundParameters.Bee.WingSpeed, wingSpeed);
        var result = SoundBus.Play(Sounds.Bee, context);
        if (result.Accepted)
            buzzing = result.Handle;
        else
            Debug.LogWarning($"Could not play Bee: {result.Status}", this);
    }

    private void Update()
    {
        if (SoundBus.IsAlive(buzzing))
            SoundBus.SetFloat(buzzing, SoundParameters.Bee.WingSpeed, wingSpeed);
    }

    [ContextMenu("Stop buzzing")]
    public void StopBuzzing()
    {
        if (SoundBus.IsAlive(buzzing))
            SoundBus.Stop(buzzing);
        buzzing = default;
    }

    private void OnDisable() => StopBuzzing();
}
