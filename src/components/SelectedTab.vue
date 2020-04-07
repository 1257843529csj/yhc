
<template>
  <div class='selected'>
    <div class="text">已选座位:</div>
    <div class="scroll" v-show="selectedSeat.length > 0">
      <ul class="scroll-ul">
        <li class="scroll-item" v-for="item in selectedSeat"  @click="cancelSelect(item)">
          {{item.SeatRow}}排{{item.SeatCol}}座 
        </li>
      </ul>
    </div>
    <div class="motext" v-show="selectedSeat.length == 0">您尚未选座，请选择观影位置</div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
export default {
// import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    propSelectedSeat: Array
  },
  data () {
    // 这里存放数据
    return {
      selectedSeat: this.propSelectedSeat
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
 
  // 方法集合
  methods: {
    cancelSelect: function (item) {
      this.$emit('cancelSelect', item.orgIndex)
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
  },
  beforeCreate () {}, // 生命周期 - 创建之前
  beforeMount () {}, // 生命周期 - 挂载之前
  beforeUpdate () {}, // 生命周期 - 更新之前
  updated () {}, // 生命周期 - 更新之后
  beforeDestroy () {}, // 生命周期 - 销毁之前
  destroyed () {}, // 生命周期 - 销毁完成
  activated () {} // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
