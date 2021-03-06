define(['quark', 'knockout', 'quark-testing-helper'], function($$, ko, Helper) {
    var helper = new Helper({});

    describe('Screen <%- tag %> Tests', function() {
        beforeAll(function(done) {
            helper.load('<%- tag %>', done);
        })

        afterAll(function() {
            helper.reset();
        });

        it('must contain the correct message', function() {
            var model = helper.models.<%- className %>;

            expect(model.title).toBe("Welcome to <%= tag %> screen");
        });
    });
});
