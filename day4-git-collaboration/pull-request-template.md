# Pull Request Template

## Description

<!-- Provide a brief description of the changes in this PR -->

### What does this PR do?
<!-- Explain what functionality is being added, changed, or fixed -->

### Why is this change needed?
<!-- Explain the motivation for this change -->

### How was this implemented?
<!-- Briefly describe the approach taken -->

## Type of Change

<!-- Mark the relevant option with an [x] -->

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update (changes to documentation only)
- [ ] 🎨 Code style/formatting (changes that do not affect the meaning of the code)
- [ ] ♻️ Refactoring (code change that neither fixes a bug nor adds a feature)
- [ ] ⚡ Performance improvement
- [ ] 🧪 Test changes (adding missing tests or correcting existing tests)
- [ ] 🔧 Build/CI changes (changes to build process or CI configuration)

## Related Issues

<!-- Link to related issues using keywords -->
<!-- Examples: -->
<!-- Closes #123 -->
<!-- Fixes #456 -->
<!-- Resolves #789 -->
<!-- Related to #101 -->

- Closes #
- Related to #

## Screenshots/Videos

<!-- If applicable, add screenshots or videos to help explain your changes -->
<!-- For UI changes, include before/after screenshots -->

### Before
<!-- Screenshot or description of current state -->

### After
<!-- Screenshot or description of new state -->

## Testing

### How Has This Been Tested?

<!-- Describe the tests that you ran to verify your changes -->

- [ ] Unit tests
- [ ] Integration tests
- [ ] End-to-end tests
- [ ] Manual testing
- [ ] Browser testing (specify browsers)
- [ ] Mobile testing

### Test Coverage

<!-- If applicable, mention test coverage changes -->

- Current coverage: __%
- Coverage after changes: __%
- New tests added: __

### Manual Testing Steps

<!-- Provide step-by-step instructions for manual testing -->

1. Step 1
2. Step 2
3. Step 3
4. Expected result

## Code Quality Checklist

<!-- Ensure your code meets quality standards -->

### Code Standards
- [ ] Code follows the project's style guidelines
- [ ] Code is properly formatted (ran `npm run format`)
- [ ] No linting errors (ran `npm run lint`)
- [ ] No console.log statements left in code
- [ ] No commented-out code blocks
- [ ] Variable and function names are descriptive

### Documentation
- [ ] Code is self-documenting with clear variable/function names
- [ ] Complex logic is commented
- [ ] JSDoc comments added for public functions
- [ ] README updated if needed
- [ ] API documentation updated if needed

### Testing
- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Edge cases are covered
- [ ] Error conditions are tested
- [ ] Tests are meaningful and not just for coverage

### Security
- [ ] No sensitive data (passwords, keys, tokens) in code
- [ ] Input validation implemented where needed
- [ ] No obvious security vulnerabilities
- [ ] Dependencies are up to date

## Performance Impact

<!-- Describe any performance implications -->

- [ ] No performance impact
- [ ] Performance improved
- [ ] Performance may be affected (explain below)

### Performance Notes
<!-- If performance is affected, explain the impact and any mitigation strategies -->

## Breaking Changes

<!-- If this is a breaking change, describe what breaks and how to migrate -->

### What breaks?
<!-- List what existing functionality will no longer work -->

### Migration Guide
<!-- Provide step-by-step migration instructions -->

1. Step 1
2. Step 2
3. Step 3

## Dependencies

<!-- List any new dependencies or dependency changes -->

### New Dependencies
- [ ] No new dependencies
- [ ] New dependencies added (list below)

### Dependency Changes
<!-- List any added, updated, or removed dependencies -->

- Added: 
- Updated: 
- Removed: 

## Deployment Notes

<!-- Any special deployment considerations -->

- [ ] No special deployment steps needed
- [ ] Database migrations required
- [ ] Environment variables need to be updated
- [ ] Configuration changes required
- [ ] Special deployment steps (describe below)

### Deployment Steps
<!-- If special steps are needed, list them here -->

1. Step 1
2. Step 2
3. Step 3

## Rollback Plan

<!-- Describe how to rollback if issues are found after deployment -->

- [ ] Standard rollback (revert commit)
- [ ] Special rollback steps required (describe below)

### Rollback Steps
<!-- If special rollback steps are needed -->

1. Step 1
2. Step 2
3. Step 3

## Review Checklist

<!-- For reviewers to check off -->

### Functionality Review
- [ ] Feature works as described
- [ ] Edge cases are handled properly
- [ ] Error conditions are handled gracefully
- [ ] No obvious bugs or logic errors

### Code Review
- [ ] Code is readable and well-organized
- [ ] Functions are appropriately sized
- [ ] No code duplication
- [ ] Follows project conventions
- [ ] Security considerations addressed

### Testing Review
- [ ] Adequate test coverage
- [ ] Tests are meaningful
- [ ] Tests pass consistently
- [ ] Manual testing completed

## Additional Notes

<!-- Any additional information for reviewers -->

### Known Issues
<!-- List any known issues or limitations -->

### Future Improvements
<!-- Suggest any future improvements or follow-up work -->

### Questions for Reviewers
<!-- Any specific questions or areas where you'd like feedback -->

---

## Reviewer Guidelines

### For Authors
- [ ] Self-review completed before requesting review
- [ ] All checklist items addressed
- [ ] Clear description provided
- [ ] Tests added and passing
- [ ] Ready for review

### For Reviewers
- [ ] Functionality tested locally
- [ ] Code quality reviewed
- [ ] Security implications considered
- [ ] Performance impact assessed
- [ ] Documentation reviewed

### Review Process
1. **Author**: Complete all checklist items and request review
2. **Reviewer**: Review code, test functionality, provide feedback
3. **Author**: Address feedback and re-request review
4. **Reviewer**: Approve when satisfied
5. **Maintainer**: Merge when all checks pass

---

**Thank you for contributing! 🚀**

<!-- 
Template Usage Instructions:
1. Fill out all relevant sections
2. Check off completed items
3. Remove any sections that don't apply
4. Be thorough but concise
5. Include screenshots for UI changes
6. Test your changes before requesting review
-->