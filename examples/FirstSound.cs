using DEV505.SoundManager;
using UnityEngine;

public sealed class FirstSound : MonoBehaviour
{
    private SoundHandle fire;

    private void Start() => PlaySound();

    [ContextMenu("Play sound")]
    public void PlaySound()
    {
        if (!isActiveAndEnabled || !Application.isPlaying || SoundBus.IsAlive(fire))
            return;

        var result = SoundBus.Play(Sounds.Campfire, transform);
        if (result.Accepted)
            fire = result.Handle;
        else
            Debug.LogWarning($"Could not play Campfire: {result.Status}", this);
    }

    [ContextMenu("Stop sound")]
    public void StopSound()
    {
        if (SoundBus.IsAlive(fire))
            SoundBus.Stop(fire, 0.15f);
        fire = default;
    }

    private void OnDisable() => StopSound();
}
