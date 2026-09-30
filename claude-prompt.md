# Claude Sonnet Website Prompt

You are Claude Sonnet 5.5, acting as a senior product designer, creative director, and production-grade frontend engineer.

Create a complete, original product website for **MCPveil**, a deterministic security test suite and CLI for Model Context Protocol (MCP) servers.

## Source of truth

Before designing or writing code, inspect the project repository carefully and use it as the authoritative source for the product’s capabilities, terminology, commands, limitations, installation flow, security model, and current status:

- GitHub: https://github.com/Pratham2511/mcpveli
- npm package: https://www.npmjs.com/package/mcpveil-cli

Do not invent product features, claims, metrics, integrations, testimonials, customer logos, or security guarantees that are not supported by the repository. If information is unclear, use accurate restrained language instead of fabricating it.

## Creative direction

Go all out creatively. Do **not** use a generic AI SaaS landing-page template, predictable gradients, stock-dashboard layouts, repetitive glass cards, fake terminal decoration, or visual filler. Do not prescribe or copy a particular design style: independently discover a distinctive visual direction that makes the product memorable and credible. The design may be unexpected or unrelated to conventional cybersecurity aesthetics as long as it communicates trust, technical depth, and product value.

The result should feel art-directed, intentional, and made by an excellent independent studio—not generated from a template. Explore a strong visual concept, surprising composition, meaningful typography, and a coherent interaction language. Keep the content legible and the product understandable within seconds.

Create an original MCPveil logo/mark as part of the site. It should be a real, usable visual identity element rather than a text emoji or an arbitrary generic shield icon. Prefer an original SVG or CSS-built mark that fits the chosen art direction and remains recognizable at small sizes.

## Technical requirements

- Use Three.js for a meaningful, performance-conscious interactive visual experience. It must support the product story, not exist merely as decoration.
- Use the project’s existing framework, dependencies, and conventions where applicable.
- Build a polished responsive experience for desktop, tablet, and mobile.
- Use semantic HTML, accessible contrast, keyboard-friendly interactions, reduced-motion support, and descriptive labels.
- Make the first viewport compelling without hiding the core product explanation.
- Use real repository-derived copy and working links.
- Include clear calls to action for viewing the GitHub repository and installing the npm package.
- Include a concise installation or quick-start path based on the actual project documentation.
- Handle WebGL-unavailable and reduced-motion cases gracefully with a strong fallback presentation.
- Optimize the Three.js scene: avoid unnecessary geometry, excessive post-processing, memory leaks, and main-thread work. Clean up resources when appropriate.
- Do not add fake functionality. Buttons and links should either work or be clearly presented as unavailable.

## Expected output

First inspect the repository, then briefly explain the concept and information architecture you chose. After that, implement the complete website—not a wireframe, placeholder, or partial mockup.

The final page should promote MCPveil as a serious open-source developer security product while retaining a distinctive creative identity. Ensure the final implementation is clean, maintainable, production-ready, and free of placeholder copy and AI-generated visual clichés.

Validate the result locally before finishing: check the build, test the main interactions, verify all links, and confirm the responsive layout and WebGL fallback.
