type RecipeScalingControlsProps = {
  selectedScale: number;
  onScaleChange: (scale: number) => void;
};

const SCALE_OPTIONS = [1, 2, 3];

export default function RecipeScalingControls({
  selectedScale,
  onScaleChange,
}: RecipeScalingControlsProps) {
  return (
    <div className="scaling-buttons" aria-label="Scale recipe">
      {SCALE_OPTIONS.map((scale) => (
        <button
          key={scale}
          type="button"
          className={selectedScale === scale ? "active-scale" : ""}
          onClick={() => onScaleChange(scale)}
        >
          {scale}x
        </button>
      ))}
    </div>
  );
}
