# Content Review Status System

## Overview
This document describes the review status system used for WordPress resources, enabling SEO-friendly pages even for products not yet fully reviewed.

## Review Status Types

### 1. `complete`
- Full review has been conducted and published
- Contains comprehensive analysis, pros/cons, ratings, and verdict
- Example: Blocksy, Astra, GeneratePress

### 2. `active`
- Currently being tested and reviewed
- Shows testing progress and preliminary findings
- Includes completion percentage and current testing phase
- Example: Bricks Builder

### 3. `backlog`
- Scheduled for future review
- Provides initial notes and community feedback
- Includes estimated review date
- Example: Elementor (waiting for v4.0)

### 4. `skip`
- Not planning to review due to known issues
- Explains why review is being skipped
- Provides alternatives and warnings
- Example: WPBakery (outdated technology)

## Schema Fields for Review Management

### Required Fields
```yaml
review_status: "complete|active|backlog|skip"
```

### Status-Specific Fields

#### For `backlog` Status:
```yaml
review_status: "backlog"
review_reason: "Why the review is delayed"
initial_notes:
  - "Preliminary observation 1"
  - "Preliminary observation 2"
community_feedback:
  positive:
    - "Positive feedback point"
  negative:
    - "Negative feedback point"
estimated_review_date: "YYYY-MM"
subscribe_cta: "Custom CTA for email notifications"
```

#### For `skip` Status:
```yaml
review_status: "skip"
review_reason: "Why we're not reviewing this"
initial_notes:
  - "Known issue 1"
  - "Known issue 2"
alternatives:
  - name: "Alternative Product"
    reason: "Why it's better"
community_feedback:
  warnings:
    - "Warning point 1"
    - "Warning point 2"
```

#### For `active` Status:
```yaml
review_status: "active"
review_reason: "Current testing focus"
testing_progress:
  started: "YYYY-MM-DD"
  completion: 65  # percentage
  current_phase: "Performance testing"
  next_phase: "Developer workflow"
preliminary_findings:
  performance:
    - "Finding 1"
  developer_experience:
    - "Finding 2"
  concerns:
    - "Concern 1"
test_sites:
  - url: "demo.example.com"
    pagespeed_mobile: 94
    pagespeed_desktop: 99
early_verdict: "Initial impression"
```

#### For `complete` Status:
```yaml
review_status: "complete"
# Full review content in MDX body
# All standard rating and review fields
```

## SEO Benefits

1. **Coverage**: Create pages for all relevant products, even those not reviewed
2. **Transparency**: Be honest about review status with users
3. **Engagement**: Capture email signups for future reviews
4. **Authority**: Show expertise through preliminary analysis
5. **Freshness**: Indicate active testing and upcoming content

## Content Templates

### Backlog Template
```markdown
# {Product} - Pending Review

We haven't completed our full review of {Product} yet. 
**Reason:** {review_reason}

## Initial Notes
{initial_notes}

## Community Feedback
{community_feedback}

## Subscribe for Updates
{subscribe_cta}
```

### Skip Template
```markdown
# {Product} - Review Skipped

We're not planning to review {Product}. 
**Reason:** {review_reason}

## Known Issues
{initial_notes}

## Better Alternatives
{alternatives}

## Community Warnings
{warnings}
```

### Active Template
```markdown
# {Product} - Review In Progress

We're currently testing {Product}. 
**Status:** {review_reason}

## Testing Progress: {completion}% Complete
Current Phase: {current_phase}
Next Phase: {next_phase}

## Preliminary Findings
{preliminary_findings}

## Early Verdict
{early_verdict}
```

## Implementation Notes

- Use consistent badge colors based on status
- Include subscribe CTAs for non-complete statuses
- Show testing progress bars for active reviews
- Display estimated dates for backlog items
- Highlight alternatives for skipped products

## Benefits for Users

1. **Transparency**: Know why certain products aren't reviewed
2. **Alternatives**: Get recommendations even for skipped products
3. **Updates**: Subscribe to be notified when reviews complete
4. **Preview**: See preliminary findings for products being tested
5. **Planning**: Know what reviews are coming and when