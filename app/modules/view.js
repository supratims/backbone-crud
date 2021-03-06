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
  var ProductList = Backbone.Collection.extend({
    model: Product
  });

  var AddItemPaneView = Backbone.View.extend({
	tagName: 'div',
    render: function(){
    	//consider using a mustache template ?
    	$(this.el).attr('id', 'addBrandPane').addClass('col-xs-12').addClass('padding-top-20')
			.append('<div class="form-group"><label class="control-label" for="brand">Name</label><input type="text" id="brand" class="form-control" placeholder="Enter name"></div><button class="btn btn-success savebtn">Save</button>')
    	return this;
    },
    unrender: function(){
      $(this.el).remove();
    },
  });

  var ProductView = Backbone.View.extend({
    tagName: 'li',
    events: {
      'click button.btn.removeProductBtn': 'remove',
    },
    initialize: function(){
      _.bindAll(this, 'render', 'unrender', 'remove'); // every function that uses 'this' as the current object should be in here

      this.model.bind('change', this.render);
      this.model.bind('remove', this.unrender);
    },
    render: function(){
      $(this.el).addClass('list-group-item')
      	.append(this.model.get('name') + '<button class="pull-right btn btn-xs btn-danger removeProductBtn">Delete</button>');

      return this;
    },
    unrender: function(){
      $(this.el).remove();
    },
    remove: function(){
      this.model.destroy();
    }
  });

  var BrandView = Backbone.View.extend({
    tagName: 'div',
    events: {
      'click button.btn.removeBrandBtn': 'remove',
      'click button.btn.addProductBtn' : 'showForm',
      'click button.btn.savebtn': 'addProduct',
    },
    initialize: function(){
      _.bindAll(this, 'render', 'unrender', 'remove', 'showForm', 'addProduct', 'appendItem'); // every function that uses 'this' as the current object should be in here
      this.collection = new ProductList();
      this.collection.bind('add', this.appendItem);

      this.counter = 0;
      this.model.bind('change', this.render);
      this.model.bind('remove', this.unrender);
    },
    render: function(){
      $(this.el).addClass('panel panel-default')
      	.append('<div class="panel-heading">#' + this.model.get('id') + ' ' +this.model.get('name') +
      	    ' <button class="pull-right btn btn-xs btn-success addProductBtn">Add items</button>' +
      		' <button class="pull-right btn btn-xs btn-danger removeBrandBtn">Delete</button> </div>')
      	.append('<div class="panel-body"> ' + '<div class="prodformarea"></div> <ul class="list-group col-xs-12 pull-left"></ul>' + '</div>');
      return this;
    },
    unrender: function(){
      $(this.el).remove();
    },
    remove: function(){
      this.model.destroy();
    },
    showForm: function() {
      if (this.addPaneView) return;
      var addPaneView = new AddItemPaneView();
      $('.prodformarea', this.el).html(addPaneView.render().el);
      this.addPaneView = addPaneView;
    },
    addProduct: function() {
      if (!this.addPaneView) return;
      if (!$('#brand').val() || !$('#brand').val().trim()) {
      	this.addPaneView.$('div.form-group').addClass('has-error');
	    return;
      } else {
        this.addPaneView.$('div.form-group').removeClass('has-error');
      }
      this.counter++;
      var product = new Product();
      product.set({
        id: this.counter,
        name: $('#brand').val(),
        brandId: '-1'
      });
      this.addPaneView.unrender();
      this.addPaneView=null;
      this.collection.add(product);
    },
    appendItem: function(product) {
      var productView = new ProductView({
        model: product
      });

      $('.list-group', this.el).append(productView.render().el);

    }
  });

  var BrandListView = Backbone.View.extend({
    el: $('.root'),
    events: {
      'click button.addBrandBtn': 'showForm',
      'click button.savebtn': 'addItem',
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
      this.addPaneView = addPaneView;
    },
    addItem: function(){
      if (!this.addPaneView) return;
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