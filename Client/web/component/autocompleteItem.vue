<script>
    module.exports={
        functional: true,
        render: function (h, ctx) {
            var item = ctx.props.item;
            return h('li', ctx.data, [
                h('div', { attrs: { class: 'value' } }, [item.value]),
                h('span', { attrs: { class: 'remark' } }, [item.remark])
            ]);
        },
        props: ["item"]
    }
</script>