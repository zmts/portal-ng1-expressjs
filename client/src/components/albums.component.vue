<template>
    <div class="albums">
        albums
    </div>
</template>

<script>
    import moment from 'moment'

    export default {
        name: 'Albums',
        data () {
            return {
                dateTime: `${moment().format('MMM DD YYYY ')} at ${moment().format('hh:mm')}`
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../scss/style";
    .albums {
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0.2);
        padding: 20px;
        z-index: 1;
        flex-grow: 1;
    }
</style>
