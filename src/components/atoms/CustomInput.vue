<template>
    <div class="custom-input"
        :disabled="disabled"
    >
        <input class="--input" 
            v-model="parent[item]"
            :placeholder="placeholder"
            :disabled="disabled"
            :data-novalid="novalid"
            :type="type"
            @keyup="$emit('keyup')"
            @blur="$emit('blur')"
        />
        <div class="--delete"
            :data-visible="(parent[item] && String(parent[item]).length > 0) === true"
            @click="clickDelete($event)"
        ></div>
    </div>
</template>

<script lang="ts">

interface Iobject {
  [key: string]: any
}

export default {
  name: 'CustomInput',
  props: {
    parent: {
      required: true,
    },
    item: {
      required: true,
    },
    disabled: {
      default: false,
    },
    type: {
      required: true,
    },
    novalid: {
      required: true,
    },
    placeholder: {
      default: '',
    },
  },
  data() {
    return {

    }
  },
  methods: {
    clickDelete(e: Iobject): void {
      this.parent[this.item] = ''
      e.target.closest('.custom-input').querySelector('.--input').focus()
    },
  },
} as Iobject
</script>

<style lang="scss">
@import '@/assets/css/variables.scss';

.custom-input {
    display: inline-block;
    width: 100%;
    border: 1px solid #999;
    border-radius: 3px;
    background: #fff;
    position: relative;

    .--input {
        outline: none;
        padding: 4px 25px 4px 4px;
        border-radius: 3px;
        width: 100%;
        box-sizing: border-box;
        border: 0;
        box-shadow: none;
    }

    .--input[data-novalid]  {
      background: rgb(255, 233, 233);
    }

    .--delete {
        position: absolute;
        z-index: 2;
        right: 0;
        top: 0;
        height: 23px;
        width: 23px;
        border-radius: 3px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
    }
    .--delete[data-visible] {
        opacity: 1;
    }
    .--delete:after,
    .--delete:before {
        content: "";
        position: absolute;
        left: 50%;
        top: 5px;
        transform: rotate(45deg);
        width: 1px;
        height: 14px;
        background: #999;
    }
    .--delete:before {
        transform: rotate(-45deg);
    }
}

.custom-input[disabled] {
    opacity: $disabled-opacity;
}
</style>
