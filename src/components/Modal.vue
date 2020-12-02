<template>
    <div class="modal-bg" v-show="show">
        <div class="modal-container">
            <div class="modal-header">
                {{ title }}
            </div>
            <div class="modal-main">
                <slot></slot>
            </div>
            <div class="modal-footer">
                <button @click="hideModal">我知道了</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Modal',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
    },
    
    methods: {
        hideModal() {
            this.$emit('hideModal')
        },

        
    }
}
</script>

<style scoped>
.modal-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
    z-index: 9999;
}
.modal-container {
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
.modal-header {
    height: 30px;
    background: #8f7a66;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: move;
}
.modal-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    border-top: 1px solid #ddd;
    border: solid 1px #8f7a66;
}
.modal-footer button {
    width: 100px;
    
    background-color: #8f7a66;
    border-radius: 100rpx 100rpx 100rpx 100rpx;
    
}
.modal-main {
    padding: 15px 40px;
}
</style>