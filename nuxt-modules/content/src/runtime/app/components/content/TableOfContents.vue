<script setup lang="ts">
const props = defineProps<{
	content: string;
}>();
</script>

<template>
	<TableOfContents :content="content" />
</template>
