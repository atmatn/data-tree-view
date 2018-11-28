<template>
  <div>
    <Button type="primary" @click="modal1 = true">编辑模式</Button>
    <Modal
        v-model="modal1"
        draggable
        scrollable
        title="编辑数据"
        @on-ok="ok"
        @on-cancel="cancel">
        <edits></edits>
    </Modal>
  </div>
</template>
<script>
import edits from '@/components/modal/edit.vue'

export default {
        components:{edits},
        data () {
            return {
                modal1: false
            }
        },
        methods: {
            ok () {
                this.$Message.info('保存成功');
            },
            cancel () {
                this.$Message.info('取消保存');
            }
        }
    }
</script>
