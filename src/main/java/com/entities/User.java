package com.entities;

import java.io.Serializable;
import jakarta.persistence.*;
import java.util.Date;
import java.util.List;


/**
 * The persistent class for the users database table.
 * 
 */
@Entity
@Table(name="users")
@NamedQuery(name="User.findAll", query="SELECT u FROM User u")
public class User implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="user_id")
	private int userId;

	@Temporal(TemporalType.DATE)
	private Date birthday;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="create_date")
	private Date createDate;

	private String email;

	@Column(name="full_name")
	private String fullName;

	private int gender;

	private String image;

	private String password;

	private String phone;

	private boolean status;

	private String username;

	//bi-directional many-to-one association to Address
	@OneToMany(mappedBy="user")
	private List<Address> addresses;

	//bi-directional many-to-one association to Cart
	@OneToMany(mappedBy="user")
	private List<Cart> carts;

	//bi-directional many-to-one association to Feedback
	@OneToMany(mappedBy="user")
	private List<Feedback> feedbacks;

	//bi-directional many-to-one association to Image
	@OneToMany(mappedBy="user")
	private List<Image> images;

	//bi-directional many-to-one association to ManagePermission
	@OneToMany(mappedBy="user")
	private List<ManagePermission> managePermissions;

	//bi-directional many-to-one association to OrderHistory
	@OneToMany(mappedBy="user")
	private List<OrderHistory> orderHistories;

	//bi-directional many-to-one association to Order
	@OneToMany(mappedBy="user")
	private List<Order> orders;

	//bi-directional many-to-one association to Reply
	@OneToMany(mappedBy="user")
	private List<Reply> replies;

	//bi-directional many-to-one association to UserCoupon
	@OneToMany(mappedBy="user")
	private List<UserCoupon> userCoupons;

	//bi-directional many-to-one association to UserRole
	@OneToMany(mappedBy="user")
	private List<UserRole> userRoles;

	//bi-directional many-to-one association to Wishlist
	@OneToMany(mappedBy="user")
	private List<Wishlist> wishlists;

	public User() {
	}

	public int getUserId() {
		return this.userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public Date getBirthday() {
		return this.birthday;
	}

	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}

	public Date getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getFullName() {
		return this.fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public int getGender() {
		return this.gender;
	}

	public void setGender(int gender) {
		this.gender = gender;
	}

	public String getImage() {
		return this.image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPhone() {
		return this.phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public boolean isStatus() {
		return this.status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

	public String getUsername() {
		return this.username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public List<Address> getAddresses() {
		return this.addresses;
	}

	public void setAddresses(List<Address> addresses) {
		this.addresses = addresses;
	}

	public Address addAddress(Address address) {
		getAddresses().add(address);
		address.setUser(this);

		return address;
	}

	public Address removeAddress(Address address) {
		getAddresses().remove(address);
		address.setUser(null);

		return address;
	}

	public List<Cart> getCarts() {
		return this.carts;
	}

	public void setCarts(List<Cart> carts) {
		this.carts = carts;
	}

	public Cart addCart(Cart cart) {
		getCarts().add(cart);
		cart.setUser(this);

		return cart;
	}

	public Cart removeCart(Cart cart) {
		getCarts().remove(cart);
		cart.setUser(null);

		return cart;
	}

	public List<Feedback> getFeedbacks() {
		return this.feedbacks;
	}

	public void setFeedbacks(List<Feedback> feedbacks) {
		this.feedbacks = feedbacks;
	}

	public Feedback addFeedback(Feedback feedback) {
		getFeedbacks().add(feedback);
		feedback.setUser(this);

		return feedback;
	}

	public Feedback removeFeedback(Feedback feedback) {
		getFeedbacks().remove(feedback);
		feedback.setUser(null);

		return feedback;
	}

	public List<Image> getImages() {
		return this.images;
	}

	public void setImages(List<Image> images) {
		this.images = images;
	}

	public Image addImage(Image image) {
		getImages().add(image);
		image.setUser(this);

		return image;
	}

	public Image removeImage(Image image) {
		getImages().remove(image);
		image.setUser(null);

		return image;
	}

	public List<ManagePermission> getManagePermissions() {
		return this.managePermissions;
	}

	public void setManagePermissions(List<ManagePermission> managePermissions) {
		this.managePermissions = managePermissions;
	}

	public ManagePermission addManagePermission(ManagePermission managePermission) {
		getManagePermissions().add(managePermission);
		managePermission.setUser(this);

		return managePermission;
	}

	public ManagePermission removeManagePermission(ManagePermission managePermission) {
		getManagePermissions().remove(managePermission);
		managePermission.setUser(null);

		return managePermission;
	}

	public List<OrderHistory> getOrderHistories() {
		return this.orderHistories;
	}

	public void setOrderHistories(List<OrderHistory> orderHistories) {
		this.orderHistories = orderHistories;
	}

	public OrderHistory addOrderHistory(OrderHistory orderHistory) {
		getOrderHistories().add(orderHistory);
		orderHistory.setUser(this);

		return orderHistory;
	}

	public OrderHistory removeOrderHistory(OrderHistory orderHistory) {
		getOrderHistories().remove(orderHistory);
		orderHistory.setUser(null);

		return orderHistory;
	}

	public List<Order> getOrders() {
		return this.orders;
	}

	public void setOrders(List<Order> orders) {
		this.orders = orders;
	}

	public Order addOrder(Order order) {
		getOrders().add(order);
		order.setUser(this);

		return order;
	}

	public Order removeOrder(Order order) {
		getOrders().remove(order);
		order.setUser(null);

		return order;
	}

	public List<Reply> getReplies() {
		return this.replies;
	}

	public void setReplies(List<Reply> replies) {
		this.replies = replies;
	}

	public Reply addReply(Reply reply) {
		getReplies().add(reply);
		reply.setUser(this);

		return reply;
	}

	public Reply removeReply(Reply reply) {
		getReplies().remove(reply);
		reply.setUser(null);

		return reply;
	}

	public List<UserCoupon> getUserCoupons() {
		return this.userCoupons;
	}

	public void setUserCoupons(List<UserCoupon> userCoupons) {
		this.userCoupons = userCoupons;
	}

	public UserCoupon addUserCoupon(UserCoupon userCoupon) {
		getUserCoupons().add(userCoupon);
		userCoupon.setUser(this);

		return userCoupon;
	}

	public UserCoupon removeUserCoupon(UserCoupon userCoupon) {
		getUserCoupons().remove(userCoupon);
		userCoupon.setUser(null);

		return userCoupon;
	}

	public List<UserRole> getUserRoles() {
		return this.userRoles;
	}

	public void setUserRoles(List<UserRole> userRoles) {
		this.userRoles = userRoles;
	}

	public UserRole addUserRole(UserRole userRole) {
		getUserRoles().add(userRole);
		userRole.setUser(this);

		return userRole;
	}

	public UserRole removeUserRole(UserRole userRole) {
		getUserRoles().remove(userRole);
		userRole.setUser(null);

		return userRole;
	}

	public List<Wishlist> getWishlists() {
		return this.wishlists;
	}

	public void setWishlists(List<Wishlist> wishlists) {
		this.wishlists = wishlists;
	}

	public Wishlist addWishlist(Wishlist wishlist) {
		getWishlists().add(wishlist);
		wishlist.setUser(this);

		return wishlist;
	}

	public Wishlist removeWishlist(Wishlist wishlist) {
		getWishlists().remove(wishlist);
		wishlist.setUser(null);

		return wishlist;
	}

}