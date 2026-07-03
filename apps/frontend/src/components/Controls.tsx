export function Controls({
  playing,
  setPlaying,
  index,
  setIndex,
  stepsLength,
}: any) {
  return (
    <div>
      <button onClick={() => setPlaying(!playing)}>
        {playing ? "Pause" : "Play"}
      </button>

      <button onClick={() => setIndex((i: number) => Math.max(i - 1, 0))}>
        Back
      </button>

      <button
        onClick={() =>
          setIndex((i: number) => Math.min(i + 1, stepsLength - 1))
        }
      >
        Next
      </button>
    </div>
  );
}
