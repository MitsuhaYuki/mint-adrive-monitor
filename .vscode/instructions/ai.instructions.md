---
applyTo: '**'
---

# General instructions which you must follow:

- When modifying code, always ensure code maintainability; add comments only when necessary.
- Files eol use LF, indentation uses 2 spaces. Fix only errors reported by ESLint and TypeScript.
- Unless the user specifies otherwise, do not generate any documentation, reports, test code, or any other additional materials.
- When the modification is completed, do not summarize in detail what you did; simply use a short sentence to explain the changes made.

# Additional instructions you might find useful:

你将要在一个基于React的Electron项目中工作：

- 项目基于vite构建系统，使用yarn进行包管理。
- 渲染层UI组件库为Ant Design v5，当编写UI时，应当在可能的范围内使用组件库实现。
- 当遇到UI组件库无法覆盖的场景时，使用tailwindcss作为样式系统。
- 你可以使用ahooks库来方便逻辑封装与开发，除此以外，还可以参考utils目录下的工具。
- 禁止启动开发预览服务，而是让用户自行启动开发预览服务并验证修改是否完成。
- 项目结构中，前端代码位于`src/renderer`目录下，后端代码位于`src/main`目录下。
- 当你编写Git提交信息时，遵循Conventional Commits规范，并使用英文撰写，简洁描述修改内容即可。

## renderer目录相关说明：

- `src/renderer/assets`：存放附属资源，如图片、图标等。
- `src/renderer/components`：存放可复用的UI组件。
- `src/renderer/context`：存放全局上下文变量。
- `src/renderer/layout`：存放主要页面。
- `src/renderer/layout/sections`：存放主要功能组件。
- `src/renderer/types`：存放类型声明、枚举值、常量值。
- `src/renderer/utils`：存放工具类。

你不应当创建新的目录结构，除非用户有明确要求。
