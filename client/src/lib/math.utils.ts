export class MathUtils {
    public static clamp(number: number, min: number, max: number): number {
        if (min > max) {
            throw new Error("Min value cannot be greater than max value");
        }

        return Math.min(Math.max(number, min), max);
    }
}