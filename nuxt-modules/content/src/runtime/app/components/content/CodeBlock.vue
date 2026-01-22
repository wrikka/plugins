<script setup lang="ts">
const props = defineProps<{
	code: string;
	language?: string;
	filename?: string;
}>();
</script>

<template>
	<CodeBlock :code="code" :language="language" :filename="filename" />
</template>
