import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CartService } from '@services/cart.service';
import { Product } from '@models/product';
import _ from "lodash";

import 'rxjs/add/operator/switchMap';
import {Observable} from "rxjs/Observable";

import { ProductService } from '@services/product.service';
import { ProductImageService } from "@services/product-image.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  finishedLoading = false;
  productObservable: Observable<Product>;
  product: Product;
  thumbnails: Array<any> = [];
  hasBeenAdded: boolean = false;

  constructor(
    private productService: ProductService,
    private productImageService: ProductImageService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  addToCart(){
    this.hasBeenAdded = true;
    console.log('Add ' + this.product + ' to cart!');
    this.cartService.add(this.product);
    console.log(this.cartService.get());
  }

  buy(){
    console.log('Checkout '+this.product+'now!');
    //If item has not already been added add it to cart
    if(this.hasBeenAdded === false){
      this.addToCart();
    }
    this.redirectCart();
  }

  redirectCart(){
    this.router.navigate(['/cart']);
  }

  ngOnInit() {
    // this.product = this.productService.getById(this.route.snapshot.params['id']);
    // this.route.params.subscribe(params =>
    //   this.productObservable = this.productService.getById(params['id'])
    // );
    // this.productObservable.subscribe(
    //   (product) => this.product = product
    // );
    //Ex for when observables are implemented
    this.route.paramMap
      .switchMap((params: ParamMap) => this.productService.getById(+params.get('id')))
      .subscribe(product => {
        this.product = product;
        this.fetchThumbnails();
      });
  }

  /**
   * Retrieve product iamge hrefs from api. Stores urls in thumbnail variable.
   */
  fetchThumbnails(){
    let _this = this;
    let product = this.product;
    this.productImageService.getProductImages(product).then(
      (productImageHrefs) => {
        _this.thumbnails[product.id] = _this.thumbnails[product.id] || [];
        productImageHrefs.forEach((imageHref) => _this.thumbnails[product.id].push(imageHref));
    });
  }

  /**
   * Returns the thumbnail for the provided product
   * @param product
   * @return false | blobUrl
   */
  getThumbnail(product) {
    if(product && this.thumbnails[product.id] && this.thumbnails[product.id][0]){
      return this.thumbnails[product.id][0];
    }else{
      return false;
    }
  }
}
