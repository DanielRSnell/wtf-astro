#!/usr/bin/env python3
import os
import re
from pathlib import Path

def get_category_specific_faqs(title, categories):
    """Generate FAQs based on the product title and categories."""
    
    # Default FAQs that apply to all
    base_faqs = [
        {
            "q": f"What is {title}?",
            "a": f"{title} is a WordPress solution that helps you build and optimize your website with powerful features and excellent performance."
        },
        {
            "q": f"Is {title} worth it?",
            "a": f"Yes, {title} offers excellent value with its comprehensive feature set, regular updates, and reliable support. It's a solid investment for serious WordPress users."
        },
        {
            "q": f"How much does {title} cost?",
            "a": f"{title} offers various pricing plans to suit different needs. Check their official website for current pricing and special offers."
        }
    ]
    
    # Category-specific FAQs
    if "themes" in categories or "woocommerce-themes" in categories:
        base_faqs.extend([
            {
                "q": f"Is {title} compatible with page builders?",
                "a": f"Yes, {title} works seamlessly with popular page builders like Elementor, Gutenberg blocks, and other major builders."
            },
            {
                "q": f"Does {title} support WooCommerce?",
                "a": f"{title} includes built-in WooCommerce optimization and styling for a seamless ecommerce experience."
            },
            {
                "q": f"Is {title} mobile responsive?",
                "a": f"Absolutely! {title} is fully responsive and optimized for all devices, ensuring your site looks great on mobile, tablet, and desktop."
            }
        ])
    
    if "hosting" in categories:
        base_faqs.extend([
            {
                "q": f"What is the uptime guarantee for {title}?",
                "a": f"{title} offers reliable uptime with modern infrastructure and redundancy to keep your site running smoothly."
            },
            {
                "q": f"Does {title} offer free migration?",
                "a": f"Many hosting plans from {title} include free migration services. Check their current offerings for specific details."
            },
            {
                "q": f"What kind of support does {title} provide?",
                "a": f"{title} provides professional support through multiple channels to help you with any hosting issues."
            }
        ])
    
    if "seo" in categories:
        base_faqs.extend([
            {
                "q": f"Does {title} support schema markup?",
                "a": f"Yes, {title} includes comprehensive schema markup support to help search engines better understand your content."
            },
            {
                "q": f"Can {title} help improve Core Web Vitals?",
                "a": f"{title} includes optimization features that can help improve your Core Web Vitals scores and overall site performance."
            },
            {
                "q": f"Is {title} compatible with other SEO plugins?",
                "a": f"While {title} is comprehensive, it's designed to work well within the WordPress ecosystem. Check compatibility for specific plugin combinations."
            }
        ])
    
    if "performance" in categories:
        base_faqs.extend([
            {
                "q": f"How much can {title} improve site speed?",
                "a": f"{title} can significantly improve your site's loading speed through various optimization techniques including caching, minification, and lazy loading."
            },
            {
                "q": f"Does {title} work with CDNs?",
                "a": f"Yes, {title} is compatible with popular CDN services to further enhance your site's performance globally."
            },
            {
                "q": f"Will {title} affect my site's functionality?",
                "a": f"{title} is designed to optimize performance without breaking functionality, with safe mode options and compatibility checks."
            }
        ])
    
    if "pagebuilder" in categories:
        base_faqs.extend([
            {
                "q": f"Is {title} beginner-friendly?",
                "a": f"Yes, {title} features an intuitive interface that makes it easy for beginners while offering advanced features for professionals."
            },
            {
                "q": f"Can I create custom layouts with {title}?",
                "a": f"{title} provides extensive customization options and pre-built templates to create unique layouts for your website."
            },
            {
                "q": f"Does {title} slow down my website?",
                "a": f"{title} is optimized for performance with clean code output and efficient loading to maintain fast page speeds."
            }
        ])
    
    if "forms" in categories:
        base_faqs.extend([
            {
                "q": f"Can {title} create multi-step forms?",
                "a": f"Yes, {title} supports creating complex multi-step forms with conditional logic and progress indicators."
            },
            {
                "q": f"Does {title} integrate with email marketing services?",
                "a": f"{title} integrates with popular email marketing services and CRMs for seamless lead management."
            },
            {
                "q": f"Is {title} GDPR compliant?",
                "a": f"{title} includes features to help you create GDPR-compliant forms with proper consent management and data handling."
            }
        ])
    
    if "blocks" in categories or "gutenberg" in categories:
        base_faqs.extend([
            {
                "q": f"Does {title} work with the block editor?",
                "a": f"Yes, {title} is fully compatible with the WordPress block editor (Gutenberg) and extends its capabilities."
            },
            {
                "q": f"Can I use {title} with classic editor?",
                "a": f"{title} primarily focuses on the block editor but may offer compatibility options for classic editor users."
            },
            {
                "q": f"Are {title} blocks reusable?",
                "a": f"Yes, {title} supports reusable blocks and patterns to help you maintain consistency across your site."
            }
        ])
    
    # Always add these final FAQs
    base_faqs.extend([
        {
            "q": f"What are the alternatives to {title}?",
            "a": f"While {title} is excellent, alternatives exist depending on your specific needs. Consider your requirements for features, budget, and ease of use when comparing options."
        },
        {
            "q": f"How do I get started with {title}?",
            "a": f"Getting started with {title} is straightforward. Visit their official website, choose a plan that fits your needs, and follow their setup documentation or tutorials."
        }
    ])
    
    return base_faqs

def add_faq_to_file(file_path):
    """Add FAQ section to a single MDX file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if FAQ already exists
    if 'faq:' in content or 'faqs:' in content:
        print(f"Skipping {file_path.name} - FAQ already exists")
        return False
    
    # Extract title and categories from frontmatter
    title_match = re.search(r'^title:\s*"([^"]+)"', content, re.MULTILINE)
    category_match = re.search(r'^category:\s*\[(.*?)\]', content, re.MULTILINE | re.DOTALL)
    
    if not title_match:
        print(f"Warning: No title found in {file_path.name}")
        return False
    
    title = title_match.group(1)
    categories = []
    if category_match:
        # Extract categories
        cat_str = category_match.group(1)
        categories = [cat.strip().strip('"').strip("'") for cat in cat_str.split(',')]
    
    # Generate FAQs
    faqs = get_category_specific_faqs(title, categories)
    
    # Format FAQ section
    faq_yaml = "faq:\n"
    for faq in faqs:
        # Escape quotes in the text
        q = faq['q'].replace('"', '\\"')
        a = faq['a'].replace('"', '\\"')
        faq_yaml += f'  - q: "{q}"\n'
        faq_yaml += f'    a: "{a}"\n'
    
    # Find the end of frontmatter (first ---\n...---\n block)
    frontmatter_end = content.find('\n---\n', 3)  # Skip the opening ---
    if frontmatter_end == -1:
        print(f"Warning: Could not find frontmatter end in {file_path.name}")
        return False
    
    # Insert FAQ before the closing ---
    new_content = content[:frontmatter_end] + '\n' + faq_yaml + content[frontmatter_end:]
    
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✓ Added FAQ to {file_path.name}")
    return True

def main():
    """Process all MDX files in the wordpress-resource directory."""
    resource_dir = Path("/Users/broke/Herd/astro/blocksy-components/src/content/wordpress-resource")
    
    if not resource_dir.exists():
        print(f"Error: Directory {resource_dir} does not exist")
        return
    
    mdx_files = list(resource_dir.glob("*.mdx"))
    print(f"Found {len(mdx_files)} MDX files to process\n")
    
    success_count = 0
    for file_path in mdx_files:
        if add_faq_to_file(file_path):
            success_count += 1
    
    print(f"\n✅ Successfully added FAQs to {success_count}/{len(mdx_files)} files")

if __name__ == "__main__":
    main()