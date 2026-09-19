using System.Collections;
using System.Collections.Generic;
using DEV505.SoundManager;
using UnityEngine;

public sealed class PortalOwnerComparison : MonoBehaviour
{
    private readonly List<GameObject> rigs = new();
    private readonly List<SoundHandle> plays = new();
    public SoundHandle LastDeparture { get; private set; }

    [ContextMenu("Try Detach")]
    public void TryDetach() => Begin(true);
    [ContextMenu("Try Stop")]
    public void TryStop() => Begin(false);

    private void Begin(bool detach)
    {
        if (!Application.isPlaying || !isActiveAndEnabled) return;
        var service = SoundServices.Current;
        if (service == null || !service.Ready) return;
        rigs.RemoveAll(rig => !rig);
        plays.RemoveAll(play => !play.IsAlive());
        var rig = new GameObject("Temporary portal sound owner");
        rigs.Add(rig);
        rig.transform.position = transform.position;
        var context = SoundPlayContext.Following(rig.transform, service.OwnerOf(rig));
        var result = SoundBus.Play(detach ? Sounds.PortalEcho : Sounds.PortalCut, context);
        if (!result.Accepted)
        {
            Debug.LogWarning($"Departure could not play: {result.Status}", this);
            Destroy(rig);
            return;
        }
        LastDeparture = result.Handle;
        plays.Add(result.Handle);
        StartCoroutine(RemoveOwner(rig));
    }

    private IEnumerator RemoveOwner(GameObject rig)
    {
        yield return new WaitForSecondsRealtime(0.35f);
        // Deliberately no StopOwned: owner loss must apply this event's Stop or Detach policy.
        if (rig) Destroy(rig);
    }

    private void OnDisable()
    {
        StopAllCoroutines();
        foreach (var play in plays) SoundBus.Stop(play, 0); // Includes detached plays.
        foreach (var rig in rigs) if (rig) Destroy(rig);
        plays.Clear();
        rigs.Clear();
        LastDeparture = default;
    }
}
