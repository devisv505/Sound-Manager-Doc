using DEV505.SoundManager;
using UnityEngine;

public sealed class StormSounds : MonoBehaviour
{
    [SerializeField, Range(0, 1)] private float rain = 0.35f;
    [SerializeField, Range(0, 1)] private float wind = 0.18f;
    [SerializeField] private Transform strikePoint = null;
    private ISoundService service;
    private SoundOwnerToken owner;
    private SoundHandle weather;
    private SoundHandle thunder;

    [ContextMenu("Start weather")]
    public void StartWeather()
    {
        if (!Application.isPlaying || !isActiveAndEnabled || weather.IsAlive()) return;
        service = SoundServices.Current;
        if (service == null || !service.Ready)
        {
            Debug.LogWarning("Wait for an enabled Sound Manager to become ready.", this);
            return;
        }
        owner = service.OwnerOf(this);
        var context = SoundPlayContext.At(transform.position, owner)
            .With(SoundParameters.Weather.Rain, 0f)
            .With(SoundParameters.Weather.Wind, 0f);
        var result = SoundBus.Play(Sounds.Weather, context);
        if (result.Accepted) weather = result.Handle;
        else Debug.LogWarning($"Weather could not start: {result.Status}", this);
    }

    private void Update()
    {
        if (!weather.IsAlive()) return;
        SoundBus.SetFloat(weather, SoundParameters.Weather.Rain, rain);
        SoundBus.SetFloat(weather, SoundParameters.Weather.Wind, wind);
    }

    [ContextMenu("Strike thunder")]
    public void Strike()
    {
        if (!Application.isPlaying || !isActiveAndEnabled || !weather.IsAlive()) return;
        Vector3 position = strikePoint ? strikePoint.position : transform.position;
        var result = SoundBus.Play(Sounds.Thunder, SoundPlayContext.At(position, owner));
        if (result.Accepted)
        {
            thunder = result.Handle;
            // Flash your lightning here; the graph waits 0.55 seconds before thunder.
        }
        else Debug.LogWarning($"Thunder could not play: {result.Status}", this);
    }

    [ContextMenu("Clear weather")]
    public void Clear()
    {
        if (ReferenceEquals(service, SoundServices.Current) && owner.IsValid)
            service.StopOwned(owner, 0.85f); // Also cancels thunder still waiting in Delay.
        weather = default;
        thunder = default;
    }

    private void OnDisable()
    {
        if (ReferenceEquals(service, SoundServices.Current) && owner.IsValid)
        {
            service.StopOwned(owner, 0);
            service.ReleaseOwner(owner);
        }
        service = null;
        owner = default;
        weather = default;
        thunder = default;
    }
}
