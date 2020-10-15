export default class DeltaTime {
    private prevTimeMillis = performance.now()

    public deltaTimeMillis(): number {
        const timeNowMillis = performance.now()
        const deltaTimeMillis = Math.max(timeNowMillis - this.prevTimeMillis, 0)
        this.prevTimeMillis = timeNowMillis
        return deltaTimeMillis
    }

    public deltaTimeSecs(): number {
        const deltaTimeSecs = this.deltaTimeMillis() * 0.001
        return deltaTimeSecs
    }
}
