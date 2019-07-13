
Component({
    properties: {
        hidden: {
            type: Boolean,
            value: true,
            observer: function (newVal) {
                var self = this;

                if(newVal) return;

                setTimeout(function () {
                    self.setData({
                        up: true
                    })                    
                }, 10);

            }
        },
    },
    data: {
        up: false
    },
    methods: {
        cancel: function () {
            this.setData({
                up: false,
                hidden: true
            });
        },
        share: function () {
            this.cancel();
        }
    }
})
