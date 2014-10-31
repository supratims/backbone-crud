(function(){

  Backbone.sync = function(method, model, success, error){
    //alert("deleted !");

  }

  var Brand = Backbone.Model.extend({
    defaults: {
      id: '-1',
      name: ''
    }
  });

  var Product = Backbone.Model.extend({
    defaults: {
      id: '-1',
      brandId: '-1',
      name: ''
    }
  });

  var BrandList = Backbone.Collection.extend({
    model: Brand
  });

  var AddItemPaneView = Backbone.View.extend({
	tagName: 'div',
    render: function(){
    	//consider using a mustache template ?
    	$(this.el).attr('id', 'addBrandPane').addClass('col-xs-12').addClass('padding-top-20')
			.append('<div class="form-group"><label class="control-label" for="brand">Brand</label><input type="text" id="brand" class="form-control" placeholder="Enter brand name"></div><button class="btn btn-success savebrandbtn">Save</button>')
    	return this;
    },
    unrender: function(){
      $(this.el).remove();
    },
  });

  var BrandView = Backbone.View.extend({
    tagName: 'div',
    events: {
      'click button.btn.removeBrandBtn': 'remove'
    },
    initialize: function(){
      _.bindAll(this, 'render', 'unrender', 'remove'); // every function that uses 'this' as the current object should be in here

      this.model.bind('change', this.render);
      this.model.bind('remove', this.unrender);
    },
    render: function(){
      $(this.el).addClass('panel panel-default')
      	.append('<div class="panel-heading">Brand #' + this.model.get('id') + ' <button class="pull-right btn btn-xs btn-danger removeBrandBtn">Delete</button> </div>')
      	.append('<div class="panel-body"> ' + this.model.get('name') + '</div>');
      return this;
    },
    unrender: function(){
      $(this.el).remove();
    },
    remove: function(){
      this.model.destroy();
    }
  });

  var BrandListView = Backbone.View.extend({
    el: $('.root'),
    events: {
      'click button.addBrandBtn': 'showForm',
      'click button.savebrandbtn': 'addItem',
    },
    initialize: function(){
      _.bindAll(this, 'render', 'addItem', 'showForm', 'appendItem'); // every function in this view that uses 'this' as the current context should be init here

      this.collection = new BrandList();
      this.collection.bind('add', this.appendItem); // collection event binder

      this.counter = 0;
      this.render();
    },
    render: function(){
      var self = this;
      _(this.collection.models).each(function(item){ // load existing collection
        self.appendItem(item);
      }, this);
    },
    showForm: function() {
      if (this.addPaneView) return;
      var addPaneView = new AddItemPaneView();
      $('.formarea', this.el).html(addPaneView.render().el);
      console.log(addPaneView.el);
      this.addPaneView = addPaneView;
    },
    addItem: function(){
      if (!$('#brand').val() || !$('#brand').val().trim()) {//move this to a validator
      	this.addPaneView.$('div.form-group').addClass('has-error');
	    return;
      } else {
        this.addPaneView.$('div.form-group').removeClass('has-error');
      }
      this.counter++;
      var brand = new Brand();
      brand.set({
        id: this.counter,
        name: $('#brand').val()
      });
      this.addPaneView.unrender();
      this.addPaneView=null;
      this.collection.add(brand);
    },
    appendItem: function(brand){
      var brandView = new BrandView({
        model: brand
      });

      $('.brandlist', this.el).append(brandView.render().el);
    }
  });

  var brandListView = new BrandListView();

})();