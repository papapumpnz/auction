(function() {
  'use strict';

  angular.module('singApp.tables.dynamic')
    .directive('snBackgridDemo', snBackgridDemo)
    .factory('Backbone', BackboneFactory)
    .factory('Backgrid', BackgridFactory)
  ;

  snBackgridDemo.$inject = ['$window', 'jQuery', 'Backbone', 'Backgrid'];
  function snBackgridDemo($window, jQuery, Backbone, Backgrid) {
    return {
      link: function(scope, $el){
        function render(){
          Backgrid.InputCellEditor.prototype.attributes.class = 'form-control input-sm';

          var Territory = Backbone.Model.extend({});

          var PageableTerritories = Backbone.PageableCollection.extend({
            model: Territory,
            url: './assets/json/pageable-territories.json',
            state: {
              pageSize: 9
            },
            mode: 'client' // page entirely on the client side
          });


          var pageableTerritories = new PageableTerritories(),
            initialTerritories = pageableTerritories;
          function createBackgrid(collection){
            var columns = [{
              name: 'id', // The key of the model attribute
              label: 'ID', // The name to display in the header
              editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
              // Defines a cell type, and ID is displayed as an integer without the ',' separating 1000s.
              cell: Backgrid.IntegerCell.extend({
                orderSeparator: ''
              })
            }, {
              name: 'name',
              label: 'Name',
              // The cell type can be a reference of a Backgrid.Cell subclass, any Backgrid.Cell subclass instances like *id* above, or a string
              cell: 'string' // This is converted to 'StringCell' and a corresponding class in the Backgrid package namespace is looked up
            }, {
              name: 'pop',
              label: 'Population',
              cell: 'integer' // An integer cell is a number cell that displays humanized integers
            }, {
              name: 'url',
              label: 'URL',
              cell: 'uri' // Renders the value in an HTML <a> element
            }];
            if (scope.app.helpers.isScreen('xs')){
              columns.splice(3,1)
            }
            var pageableGrid = new Backgrid.Grid({
              columns: columns,
              collection: collection,
              className: 'table table-striped table-editable no-margin mb-sm'
            });

            var paginator = new Backgrid.Extension.Paginator({

              slideScale: 0.25, // Default is 0.5

              // Whether sorting should go back to the first page
              goBackFirstOnSort: false, // Default is true

              collection: collection,

              controls: {
                rewind: {
                  label: '<i class="fa fa-angle-double-left fa-lg"></i>',
                  title: 'First'
                },
                back: {
                  label: '<i class="fa fa-angle-left fa-lg"></i>',
                  title: 'Previous'
                },
                forward: {
                  label: '<i class="fa fa-angle-right fa-lg"></i>',
                  title: 'Next'
                },
                fastForward: {
                  label: '<i class="fa fa-angle-double-right fa-lg"></i>',
                  title: 'Last'
                }
              }
            });

            jQuery('#table-dynamic').html('').append(pageableGrid.render().$el).append(paginator.render().$el);
          }

          jQuery($window).on('sn:resize',function(){
            createBackgrid(pageableTerritories);
          });

          createBackgrid(pageableTerritories);

          jQuery('#search-countries').keyup(function(){

            var $that = jQuery(this),
              filteredCollection = initialTerritories.fullCollection.filter(function(el){
                return ~el.get('name').toUpperCase().indexOf($that.val().toUpperCase());
              });
            createBackgrid(new PageableTerritories(filteredCollection, {
              state: {
                firstPage: 1,
                currentPage: 1
              }
            }));
          });


          pageableTerritories.fetch();
        }

        render();
      }
    }
  }


  BackboneFactory.$inject = ['$window'];
  function BackboneFactory ($window) {
    return $window.Backbone;
  }

  BackgridFactory.$inject = ['$window'];
  function BackgridFactory ($window) {
    return $window.Backgrid;
  }

})();
