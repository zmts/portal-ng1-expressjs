<template>
    <div class="loading">
        <div class="sk-wave">
            <div class="sk-rect sk-rect1 loading_color"></div>
            <div class="sk-rect sk-rect2 loading_color"></div>
            <div class="sk-rect sk-rect3 loading_color"></div>
            <div class="sk-rect sk-rect4 loading_color"></div>
            <div class="sk-rect sk-rect5 loading_color"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Loading'
    }
</script>

<style scoped lang="scss">

    .loading {
        width: 100%;
        min-height: 100px;
        max-height: 300px;
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    // https://github.com/tobiasahlin/SpinKit/blob/master/scss/spinners/3-wave.scss
    $spinkit-spinner-margin: 40px auto !default;
    $spinkit-size: 40px !default;
    $spinkit-spinner-color: #bebebe !default;

    .sk-wave {
        $rectCount: 5;
        $animationDuration: 1.2s;
        $delayRange: 0.4s;

        margin: $spinkit-spinner-margin;
        width: $spinkit-size * 1.25;
        height: $spinkit-size;
        text-align: center;
        font-size: 10px;

        .sk-rect {
            background-color: $spinkit-spinner-color;
            height: 100%;
            width: 6px;
            display: inline-block;
            animation: sk-waveStretchDelay $animationDuration infinite ease-in-out;
        }

        @for $i from 1 through $rectCount {
            .sk-rect#{$i} {
                animation-delay: - $animationDuration + $delayRange / ($rectCount - 1) * ($i - 1);
            }
        }
    }

    @keyframes sk-waveStretchDelay {
        0%,
        40%,
        100% {
            transform: scaleY(0.4)
        }
        20% {
            transform: scaleY(1.0)
        }
    }

</style>
