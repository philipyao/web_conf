<template>
	<div class="header">
		<div class="header_left">
			<h2>Pconf 配置中心</h2>
		</div>
		<div class="header_right">
			<h2>头部右边 {{ boy }}</h2>
		</div>		
	</div>
</template>

<script>
	export default {
        data () {
            return {
                hello: 'HELLO',
                boy: 'BOY'
		    }
	    }
    }
</script>

<style scoped>
    .header {
        position: relative;
        height: 50px;
        line-height: 50px;
        width: 100%;
        background-color: white;
        /*border-bottom: 1px solid #eeeeee;*/
    }

    .header_left {
    	float: left;
        font-size: 16px;
    	/*width: 200px;*/
    }

    .header_right {
    	float: right;
    	/*width: 300px;*/
    }    
</style>