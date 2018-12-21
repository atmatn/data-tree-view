<script>
import { getStringFromMeta } from '@/lib/util'
export default {
  name: 'ArgHeading',
  render: function(h) {
    var meta = getStringFromMeta(this.value.meta);
    var realLevel = 3;
    if (meta.level) {
      realLevel = 2 + meta.level;
    }
    return h("h" + realLevel, {}, this.value.prompt);
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  watch: {
    value: function(v) {
      console.log("mod: " + v);
      this.$emit("input", v);
    }
  }
};
</script>

<style>
</style>
