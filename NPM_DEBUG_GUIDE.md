# NPM Debug Guide for StratusConnect

This guide helps prevent and resolve common npm issues in the StratusConnect project.

## Quick Fixes

### 1. Clear npm cache and reinstall
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 2. Check for security vulnerabilities
```bash
npm audit
npm audit fix
```

### 3. Update outdated dependencies
```bash
npm outdated
npm update
```

### 4. Verify installation
```bash
npm ls --depth=0
```

## Common Issues & Solutions

### Build Failures
- **TypeScript errors**: Run `npm run type-check` to identify issues
- **ESLint errors**: Run `npm run lint` and fix warnings
- **Missing dependencies**: Check `package.json` and run `npm install`

### Security Vulnerabilities
- **Low/Moderate**: Run `npm audit fix`
- **High/Critical**: Review and update packages manually
- **Breaking changes**: Use `npm audit fix --force` with caution

### Performance Issues
- **Slow installs**: Use `npm ci` for production builds
- **Cache issues**: Clear cache with `npm cache clean --force`
- **Network issues**: Check `.npmrc` configuration

## Available Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:dev` | Build for development |
| `npm run lint` | Run ESLint checks |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run type-check` | TypeScript type checking |
| `npm run clean` | Clean build artifacts |
| `npm run audit:fix` | Fix security vulnerabilities |
| `npm run deps:check` | Check outdated dependencies |
| `npm run deps:update` | Update dependencies |

## Configuration Files

### `.npmrc`
- Prevents common npm issues
- Optimizes performance
- Sets security levels

### `package.json`
- Defines project dependencies
- Contains build scripts
- Specifies Node.js version requirements

### `eslint.config.js`
- Configured to prevent build failures
- Warnings instead of errors for common issues
- Optimized for development workflow

### `tsconfig.json`
- Permissive TypeScript configuration
- Prevents build failures from strict type checking
- Optimized for development speed

## Troubleshooting Steps

1. **Check Node.js version**: `node --version` (should be 18+)
2. **Check npm version**: `npm --version` (should be 8+)
3. **Clear everything**: `npm run clean && npm install`
4. **Check for errors**: `npm run lint && npm run type-check`
5. **Test build**: `npm run build`

## Prevention Tips

- Always use `npm ci` in CI/CD pipelines
- Keep dependencies updated regularly
- Use exact versions for critical dependencies
- Monitor security advisories
- Test builds before deployment

## Emergency Recovery

If npm is completely broken:

1. Delete `node_modules` and `package-lock.json`
2. Clear npm cache: `npm cache clean --force`
3. Reinstall: `npm install`
4. If still failing, try: `npm install --no-optional --no-audit`

## Support

For persistent issues:
- Check npm logs: `npm config get loglevel`
- Review error messages carefully
- Check Node.js compatibility
- Consider using `yarn` as alternative package manager
