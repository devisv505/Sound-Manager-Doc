using DEV505.SoundManager;
using UnityEngine;

// Register the included Campfire event on an active SoundManager first.
public sealed class CampfireSound : MonoBehaviour
{
    private SoundHandle fire;

    public bool IsPlaying => SoundBus.IsAlive(fire);

    public void Ignite()
    {
        if (!isActiveAndEnabled || SoundBus.IsAlive(fire))
            return;

        var result = SoundBus.Play(Sounds.Campfire, transform);
        if (!result.Accepted)
        {
            Debug.LogWarning($"Campfire did not start: {result.Status}.", this);
            return;
        }

        fire = result.Handle;
    }

    public void Extinguish()
    {
        if (SoundBus.IsAlive(fire))
            SoundBus.Stop(fire, fade: 0.15f);

        fire = default;
    }

    private void OnDisable() => Extinguish();
}
