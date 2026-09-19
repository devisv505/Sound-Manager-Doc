using DEV505.SoundManager;
using UnityEngine;

public sealed class SurfaceFootsteps : MonoBehaviour
{
    // Call once when a grounded foot lands. These numbers match the demo's ground enum.
    public void PlayStep(int groundType, Vector3 contactPosition)
    {
        if (!Application.isPlaying || !isActiveAndEnabled) return;
        int surface = groundType switch { 1 => 0, 2 => 1, 3 => 2, _ => -1 };
        if (surface < 0) return; // Unknown ground or a foot in the air makes no sound.

        var context = SoundPlayContext.At(contactPosition)
            .With(SoundParameters.Footstep.Surface, surface);
        var result = SoundBus.Play(Sounds.Footstep, context);
        if (!result.Accepted)
            Debug.LogWarning($"Footstep could not play: {result.Status}", this);
        // No retained loop: the graph ends this step after its short clip finishes.
    }

    [ContextMenu("Preview grass step")]
    public void Grass() => PlayStep(1, transform.position);
    [ContextMenu("Preview stone step")]
    public void Stone() => PlayStep(2, transform.position);
    [ContextMenu("Preview wood step")]
    public void Wood() => PlayStep(3, transform.position);
}
