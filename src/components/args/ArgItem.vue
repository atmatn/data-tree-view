<script>
import ArgBool from './ArgBool.vue'
import ArgChoice from './ArgChoice.vue'
import ArgDateRange from './ArgDateRange.vue'
import ArgHeading from './ArgHeading.vue'
import ArgList from './ArgList.vue'
import ArgMultiChoice from './ArgMultiChoice.vue'
import ArgString from './ArgString.vue'

export default {
  components: {
    ArgBool,
    ArgChoice,
    ArgDateRange,
    ArgHeading,
    ArgList,
    ArgMultiChoice,
    ArgString
  },
  render: function(h) {
    var comp;
    var argDef = this.value;
    if (argDef.type == "STRING") {
      comp = h("arg-string", {
        props: {
          value: argDef
        }
      });
    } else if (argDef.type == "DATE_RANGE") {
      comp = h("arg-date-range", {
        props: {
          value: argDef
        }
      });
    } else if (argDef.type == "HEADING") {
      comp = h("arg-heading", {
        props: {
          value: argDef
        }
      });
    } else if (argDef.type == "INFO") {
      comp = h(
        "p",
        {
          props: {}
        },
        argDef.prompt
      );
    } else if (argDef.type == "LIST" || argDef.type == "INT_LIST") {
      comp = h("arg-list", {
        props: {
          value: argDef
        }
      });
    } else if (argDef.type == "CHOICE") {
      comp = h("arg-choice", {
        props: {
          value: argDef
        }
      });
    } else if (argDef.type == "MULTI_CHOICE") {
      comp = h("arg-multi-choice", {
        props: {
          value: argDef
        }
      });
    } else if (argDef.type == "BOOL") {
      comp = h("arg-bool", {
        props: {
          value: argDef
        }
      });
    } else if (argDef.type == "LAYOUT") {
      comp = null;
    } else {
      comp = h("span", {}, "do not support " + argDef.type);
    }
    var ret = h(
      "div",
      {
        props: {},
        class: {
          "arg-item": true
        },
        style: {
          "flex-basis": argDef.width
        }
      },
      [
        comp
        // ,
        // h("span", {}, JSON.stringify(argDef))
      ]
    );
    return ret;
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  }
};
</script>

<style>
</style>
