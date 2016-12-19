define(['quark', 'jquery', 'quark-testing-helper'], function($$, $, Helper) {
    var helper = new Helper();

    describe('al-switch tests', function() {
        beforeAll(function(done) {
            helper.load('switch', done);
        });

        afterAll(function() {
            helper.reset();
        });

        it('Must enable and disable via code', function() {
            var model = helper.models.switch;

            expect(model.disabled()).toBe(false);
            expect(helper.hasDOM('.bootstrap-switch-disabled')).toBe(false);

            model.disabled(true);
            expect(model.disabled()).toBe(true);
            expect(helper.hasDOM('.bootstrap-switch-disabled')).toBe(true);

            model.disabled(false);
            expect(model.disabled()).toBe(false);
        });

        it('Must check and uncheck via code', function() {
            var model = helper.models.switch;

            expect(model.checked()).toBe(false);
            expect(helper.hasDOM('.bootstrap-switch-off')).toBe(true);
            expect(helper.hasDOM('.bootstrap-switch-on')).toBe(false);

            model.checked(true);
            expect(model.checked()).toBe(true);
            expect(helper.hasDOM('.bootstrap-switch-off')).toBe(false);
            expect(helper.hasDOM('.bootstrap-switch-on')).toBe(true);
        });

        it('Must change sizes via code', function() {
            var model = helper.models.switch;

            expect(model.size()).toBe('mini');
            expect(helper.hasDOM('.bootstrap-switch-mini')).toBe(true);

            model.size('small');
            expect(model.size()).toBe('small');
            expect(helper.hasDOM('.bootstrap-switch-small')).toBe(true);

            model.size('medium');
            expect(helper.hasDOM('.bootstrap-switch-mini')).toBe(false);
            expect(helper.hasDOM('.bootstrap-switch-small')).toBe(false);
            expect(helper.hasDOM('.bootstrap-switch-large')).toBe(false);

            model.size('large');
            expect(model.size()).toBe('large');
            expect(helper.hasDOM('.bootstrap-switch-large')).toBe(true);
        });

        it('Must change colors via code', function() {
            var model = helper.models.switch;

            model.checked(false);
            expect(helper.hasDOM('.bootstrap-switch-handle-off.bootstrap-switch-default')).toBe(true);
            model.offColor('primary');
            expect(helper.hasDOM('.bootstrap-switch-handle-off.bootstrap-switch-primary')).toBe(true);
            model.offColor('success');
            expect(helper.hasDOM('.bootstrap-switch-handle-off.bootstrap-switch-success')).toBe(true);
            model.offColor('warning');
            expect(helper.hasDOM('.bootstrap-switch-handle-off.bootstrap-switch-warning')).toBe(true);
            model.offColor('danger');
            expect(helper.hasDOM('.bootstrap-switch-handle-off.bootstrap-switch-danger')).toBe(true);
            model.offColor('info');
            expect(helper.hasDOM('.bootstrap-switch-handle-off.bootstrap-switch-info')).toBe(true);

            model.checked(true);
            expect(helper.hasDOM('.bootstrap-switch-handle-on.bootstrap-switch-primary')).toBe(true);
            model.onColor('default');
            expect(helper.hasDOM('.bootstrap-switch-handle-on.bootstrap-switch-default')).toBe(true);
            model.onColor('success');
            expect(helper.hasDOM('.bootstrap-switch-handle-on.bootstrap-switch-success')).toBe(true);
            model.onColor('warning');
            expect(helper.hasDOM('.bootstrap-switch-handle-on.bootstrap-switch-warning')).toBe(true);
            model.onColor('danger');
            expect(helper.hasDOM('.bootstrap-switch-handle-on.bootstrap-switch-danger')).toBe(true);
            model.onColor('info');
            expect(helper.hasDOM('.bootstrap-switch-handle-on.bootstrap-switch-info')).toBe(true);
        });

        it('Must change text via code', function() {
            var model = helper.models.switch;

            expect(model.onText()).toBe('Si');
            expect(helper.hasDOM('.bootstrap-switch-handle-on:contains(\'Si\')')).toBe(true);
            model.onText('Aceptar');
            expect(helper.hasDOM('.bootstrap-switch-handle-on:contains(\'Aceptar\')')).toBe(true);

            expect(model.offText()).toBe('No');
            expect(helper.hasDOM('.bootstrap-switch-handle-off:contains(\'No\')')).toBe(true);
            model.offText('Cancelar');
            expect(helper.hasDOM('.bootstrap-switch-handle-off:contains(\'Cancelar\')')).toBe(true);

        });
    });

});
