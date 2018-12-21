<template>
  <MenuItem :name="this.model.id">
    <Poptip
      trigger="hover"
      title="缺少下列权限"
      :content="this.model.computedExecutablePerms.toString()"
      placement="right"
    >
      {{this.model.title}}
      <icon type="md-lock"/>
    </Poptip>
  </MenuItem>
</template>
<script>
export default {
  props: ["model"]
};
</script>
