<template>
    <div>
    	<topMenu/>
        <router-view></router-view>
        <footMenu/>
    </div>
</template>

<script>
import topMenu from '@/components/head'
import footMenu from '@/components/foot'

export default {
    name: 'app',
    data () {
        return {
        	
        }
    },
    components: {
    	topMenu, footMenu
    }
}
</script>

<style>

</style>
