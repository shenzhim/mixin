# vue2.0变更点整理

整理的文档是基于最新的版本，后面会应该有新的更新。

最终还是要以2.0的官方文档为主。

同时提供一个检查工具：

https://github.com/vuejs/vue-migration-helper  可以检查代码中的一些2.0中废弃及修改的api。

## 一. 变更点列表

#### 1.全局配置
	新增：
		Vue.config.errorHandler：全局钩子，在组建渲染或监听时发生未被捕获的错误时，触发的handler
		Vue.config.keyCodes：可以设置特殊的keycode
	删除：
		Vue.config.debug 
		Vue.config.async
		Vue.config.delimiters
		Vue.config.unsafeDelimiters

#### 2. 全局api
	新增：
		Vue.compile
	删除：
		Vue.transition
		Vue.elementDirective
		Vue.partial

#### 3. 选项 / 数据
	删除：
		props 中的 coerce转换函数
		props 中的 prop binding modes ???

#### 4. 选项 / DOM
	新增：
		render属性
	删除：
		replace属性：组件必须要有一个根元素

#### 5. 选项 / 生命周期钩子
	新增：
		beforeMount
		mounted
		beforeUpdate
		updated
		activated (keep-alive)
		deactivated (keep-alive)

	删除：
		init -> beforeCreate
		ready：-> mounted
		beforeCompile： -> created
		compiled：-> mounted
		attached
		detached

#### 6. 选项 / 资源
	删除：
		partials
		elementDirectives

#### 7. 选项 / 杂项
	新增：
		delimiters：替换了Vue.config.delimiters
		functional
	删除：
		events

#### 8. 实例属性
	删除：
		vm.$els

#### 9. 实例方法 / 数据
	删除：
		vm.$get
		vm.$eval
		vm.$interpolate
		vm.$log
		vm.$set -> Vue.set
		vm.$delete -> Vue.delete

#### 10. 实例方法 / 事件
	删除：
		vm.$dispatch：通过vue-bus来触发事件
		vm.$broadcast：同上


#### 11. 实例方法 / DOM
	删除：
		vm.$appendTo
		vm.$before
		vm.$after
		vm.$remove

#### 12. 指令

1. v-html： 
	删除 {{{ }}}

2. v-for：
	1. 删除$index，$key
	2. 参数顺序改变为： (value, index) in arr， (value, key, index) in obj
	3. track-by -> key

3. v-model：
	删除debounce属性，改用v-on:input + 3rd party debounce function

4. v-ref：
	删除此指令，直接用ref属性

5. v-el：
	删除此指令，改用ref

#### 13. 特殊元素
	新增：
		<transition>
		<transition-group>
		<keep-alive>
	删除：
		<partial>

#### 14. 服务端渲染 (新增)
	renderToString
	renderToStream
	client-side hydration


## 二. 详细说明

#### 1. v-for:
1. 删除了$index, $key两个属性
2. 遍历数组有两种方式
	1. value in arr
	2. (value, index) in arr
3. 遍历对象有三种方式
	1. value in obj
	2. (value, key) in obj
	3. (value, key, index) in obj	

#### 2. 自定义指令的变更
1. 在2.0中自定义指令的使用范围有了大幅的减少，他们只应用在底层直接操作dom的场合下。

2. 指令不再有实例，也就意味着在自定义指令的钩子函数中不存在 this。

3. bind，update，unbind原有的这些钩子函数在2.0中参数发生变化，可参看例子
  
```
<div v-example:arg.modifier="a.b"></div>

export default {
	bind (el, binding, vnode) {
		// the binding object exposes value, oldValue, expression, arg and modifiers.
		binding.expression // "a.b"
		binding.arg // "arg"
		binding.modifiers // { modifier: true }
		// the context Vue instance can be accessed as vnode.context.
	},

	// update has a few changes, see below
	update (el, binding, vnode, oldVnode) { ... },

	// componentUpdated is a new hook that is called AFTER the entire component
	// has completed the current update cycle. This means all the DOM would
	// be in updated state when this hook is called. Also, this hook is always
	// called regardless of whether this directive's value has changed or not.
	componentUpdated (el, binding, vnode, oldVNode) { ... },

	unbind (el, binding, vnode) { ... }
}		

	关于参数binding是不可变对象，通过binding.value方式来设值是没有效果的
```

4. 新增钩子函数 componentUpdated，在组件完成更新后触发，无论指令的值是否发生改变

5. 关于update钩子函数，有两点变化
	1. 不在在bind函数执行之后，自动执行了
	2. 当组件重新渲染时，无论指令绑定的值是否变化，update总会执行。可以通过 binding.value === binding.oldValue 来跳过没有必要的更新操作

#### 3. 自定义过滤器的用法及语法的变更
1. 2.0的过滤器只能用在 {{}} 中，而1.x的版本可以用在指令后，显然2.0的更加简单

2. 2.0的过滤器写法发生改变，见如下写法
```
	{{ date | formatDate('YY-MM-DD') }}
```

#### 4. 过渡系统
1. 2.0的过渡添加的class为：
		v-enter：在元素插入之前应用，在1帧之后删除
		v-enter-active：在元素插入之前应用，在过渡结束后删除
		v-leave：在元素删除触发时应用，在1帧之后删除
		v-leave-active：在元素删除触发时应用，在过渡结束后删除
	所以我们只需要将1.x的v-enter -> v-enter-active， v-leave -> v-leave-active

2. 新增 `<transition>` 标签
	这是一个抽象的组件，意味着并不会渲染出真实的dom元素，也不会在检查元素面板中显示出来，这只会对于被他包裹的元素应用过渡行为。

	例子如下：
```
	<transition>
  		<div v-if="ok">toggled content</div>
	</transition>
```

	标签的属性如下：
```
	1. name：String
		被用来主动生成css中的class名，比如 name='fade' 将会扩展为".fade-enter", ".fade-enter-active", 若不设定的话，默认是 "v"
			
	2. appear：Boolean
		是否在初次渲染时应用过渡，默认是false
			
	3. css：Boolean
		是否应用css规则，默认是true，如果设定为false，将只会触发js的构造函数，不会应用到css规则
			
	4. type：String
		transition ｜ animation

	5. mode：String
		out-in | in-out

	6. enterClass, leaveClass, enterActiveClass, leaveActiveClass, appearClass, appearActiveClass: String
```

	标签的事件如下：

	```
		before-enter
		enter
		after-enter
		before-leave
		leave
		after-leave
		before-appear
		appear
		after-appear
	```

3. 新增`<transition-group>`标签
	多个元素的过渡效果可使用此标签，过渡组 标签的属性和事件 于 `<transition>`是一样的。
	不过也有区别：
		1. <transition-group> 会渲染出一个真实的dom元素，默认是一个span，当然你也可以通过设定tag属性值来自定义渲染出的元素类型，或者使用is属性
		例子如下：
			<transition-group tag="ul" name="fade" class="container">
			或者 
			<ul is="transition-group">

		2. <transition-group>不支持mode属性

		3. <transition-group>中的字元素必须有一个唯一key属性：
			<transition-group tag="ul" name="slide">
				<li v-for="item in items" :key="item.id">
					{{ item.text }}
				</li>
			</transition-group>

4. 创建可复用的过渡
	2.0中的过渡是通过组件的方式来使用的。不再是1.x中的 Vue.transition()方式了。你可以直接通过内联属性和事件来配置你的过渡效果。
	
	但是有一个问题是，我们怎么才能创建可复用的过渡效果以及自定义的钩子函数呢？答案就是创建一个过渡组件，例子如下：

 ```
	Vue.component('fade', {
		functional: true,
		render (createElement, { children }) {
			const data = {
				props: {
			        name: 'fade'
			    },
			    on: {
			        beforeEnter () { /* ... */ }, // <-- Note hooks use camelCase in JavaScript (same as 1.x)
			        afterEnter () { /* ... */ }
			      }
			    }
			    return createElement('transition', data, children)
			  }
			})

		然后就可以这么用了
			<fade>
  				<div v-if="ok">toggled content</div>
			</fade>
```

5. v-model 变更
		1. 属性 lazy和number改为了 修饰符 :
			<input v-model="msg" lazy number> 改为： <input v-model.lazy.number="msg">

		2. 新增 .trim修饰符
	
		3. 删除debounce 属性

		4. v-model 不再关注内联属性value的值了，而只关注vue实例的data数据中的值
			data: {
					val: 1
			}
			<input v-model="val" value="2"> ／／ 渲染出来的值为1

6. props行为 变更
		1. 废弃了.once .sync修饰符，props现在都是单向绑定，如果需要在父组件中产生效果，可用触发事件的方式
	
		2. 改变props中的值被认为是一种很不好的模式， 因为在父组件重新渲染时，子组件的props的字会被覆盖。所以在2.0中，我们应该将props传递过来的数据认为是不可变的。

7. keep-alive
	keep-alive在2.0中 不再是属性了，而是标签

	用法如下：
			<keep-alive>
				<component :is="view"></component>
			</keep-alive>

8. Slots
	在2.0中不再支持 相同名称的多个`<slot>`标签。

9. Refs
	```
		<comp v-ref:foo></comp> 改为 <comp ref="foo"></comp>，动态的为： <comp :ref="dynamicRef"></comp>
	```

10. 杂项
	1. track-by 被key所替代
			<!-- 1.x -->
			<div v-for="item in items" track-by="id">

			<!-- 2.0 -->
			<div v-for="item in items" :key="item.id">

	2. 内部属性的插入方式
			<!-- 1.x -->
			<div id="{{ id }}">

			<!-- 2.0 -->
			<div :id="id">

	3. 属性绑定行为发生变化
			只有null, undefined and false 被认为是 false
			0  和 空字符串 '' 被认为是 true

	4. 在自定义组件中，v-on只监听自定义事件（通过emitted触发的事件，不监听dom事件）

	5. v-else 不在和v-show一起使用

	6. 单次绑定 {{* foo }} 方式被废弃，改为 v-once

	7. Array.prototype.$set/$remove 被废弃，改用  Vue.set or Array.prototype.splice

	8. :style 不再支持内联的 !important

	9. 替换vue实例的$data是被禁止的。


## 三. 一些更新tips

    1. 替换$dispatch 和 $broadcast 的方式为使用一个空的vue实例bus来监听事件于响应事件。