define(['quark', 'knockout', 'quark-testing-helper'], function($$, ko, Helper) {
    var helper = new Helper({
        withSidebar: ko.observable(true),
        withNavbar: ko.observable(true)
    });

    describe('al-layout tests', function() {
        describe('Simple Layout', function() {
            beforeAll(function(done) {
                helper.load('layout', done);
            })

            afterAll(function() {
                helper.reset();
            });

            it('Must set properties of hasNavbar and hasSidebar to false when those controls are NOT added as content', function() {
                var layout = helper.models.layout;

                expect(layout.hasNavbar()).toBe(false);
                expect(layout.hasSidebar()).toBe(false);
            });
        });

        describe('Full Layout', function() {
            beforeAll(function(done) {
                helper.load('full-layout', done);
            })

            afterAll(function() {
                helper.reset();
            });

            it('Must set properties of hasNavbar and hasSidebar to true when those controls ARE added as content', function() {
                var layout = helper.models.layout;

                expect(layout.hasNavbar()).toBe(true);
                expect(layout.hasSidebar()).toBe(true);
            });

            it('Must update hasNavbar property when element is removed', function() {
                var layout = helper.models.layout;

                helper.main.withNavbar(false);
                expect(layout.hasNavbar()).toBe(false);
            });

            it('Must update hasSidebar property when element is removed', function() {
                var layout = helper.models.layout;

                helper.main.withSidebar(false);
                expect(layout.hasSidebar()).toBe(false);
            });
        });
    });

});
