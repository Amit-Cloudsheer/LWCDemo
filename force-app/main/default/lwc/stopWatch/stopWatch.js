import { LightningElement, track } from 'lwc';

export default class Stopwatch extends LightningElement {
    showStartBtn = true;
    timeVal = '0:0:0:0';
    timeIntervalInstance;
    totalMilliseconds = 0;

    connectedCallback() {
        window.addEventListener('click', this.handleShowMenu);
    }


    start(event) {
        this.showStartBtn = false;
        var parentThis = this;

        // Run timer code in every 10 milliseconds
        this.timeIntervalInstance = setInterval(function () {

            // Time calculations for hours, minutes, seconds and milliseconds
            var hours = Math.floor((parentThis.totalMilliseconds % (10 * 60 * 60 * 24)) / (10 * 60 * 60));
            var minutes = Math.floor((parentThis.totalMilliseconds % (10 * 60 * 60)) / (10 * 60));
            var seconds = Math.floor((parentThis.totalMilliseconds % (10 * 60)) / 10);
            var milliseconds = Math.floor((parentThis.totalMilliseconds % (10)));

            // Output the result in the timeVal variable
            parentThis.timeVal = hours + ":" + minutes + ":" + seconds + ":" + milliseconds;

            parentThis.totalMilliseconds += 1;
        }, 100);
    }

    stop(event) {
        this.showStartBtn = true;
        clearInterval(this.timeIntervalInstance);
    }

    reset(event) {
        this.showStartBtn = true;
        this.timeVal = '0:0:0:0';
        this.totalMilliseconds = 0;
        clearInterval(this.timeIntervalInstance);
    }



}