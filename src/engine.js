class Engine {
    constructor(timeStep, update, render) {

        this.accumulatedTime       = 0;
        this.animationFrameRequest = undefined;
        this.time                  = undefined;
        this.timeStep              = timeStep;

        this.updated = false;

        this.update = update;
        this.render = render;

    }

    handleRun(timeStep) {

        this.run(timeStep);

    }

    run(timeStamp) {

        this.accumulatedTime += timeStamp - this.time;
        this.time = timeStamp;

        while (this.accumulatedTime >= this.timeStep) {

            this.accumulatedTime -= this.timeStep;
            this.update(/* timeStamp */);
            this.updated = true;

        }

        if (this.updated) {

            this.updated = false;
            this.render(/* timeStamp */);

        }

        /*
         * In function below I bind 'this' to handleRun method, because passing only this.handleRun
         * doesn't keep this as Engine class
        */
        this.animationFrameRequest = window.requestAnimationFrame(this.handleRun.bind(this));

    }

    start() {

        this.accumulatedTime = this.timeStep;
        this.time = window.performance.now();
        this.animationFrameRequest = window.requestAnimationFrame(this.handleRun.bind(this));

    }

    stop() {

        window.cancelAnimationFrame(this.animationFrameRequest);

    }
}

export default Engine;
