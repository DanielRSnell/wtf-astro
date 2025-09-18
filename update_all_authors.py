#!/usr/bin/env python3
import os
import re
from pathlib import Path

def update_author_in_content(file_path):
    """Update author to Daniel Snell in any content file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    updated = False
    
    # Replace any existing author field with Daniel Snell
    if 'author:' in content:
        new_content = re.sub(
            r'author:\s*["\']?[^"\'\n]+["\']?',
            'author: "Daniel Snell"',
            content
        )
        if new_content != content:
            content = new_content
            updated = True
            print(f"✓ Updated author in {file_path.relative_to(Path('/Users/broke/Herd/astro/blocksy-components'))}")
    
    if updated:
        # Write back to file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
    
    return updated

def process_directory(directory):
    """Process all .md and .mdx files in a directory recursively."""
    dir_path = Path(directory)
    if not dir_path.exists():
        return 0
    
    count = 0
    for file_path in dir_path.rglob("*.md*"):
        if update_author_in_content(file_path):
            count += 1
    
    return count

def main():
    """Process all content directories."""
    base_dir = "/Users/broke/Herd/astro/blocksy-components/src/content"
    
    directories = [
        "blog",
        "guides", 
        "services",
        "wordpress",
        "wordpress-category",
        "wordpress-resource",
        "wordpress-review"
    ]
    
    total_updated = 0
    
    for directory in directories:
        dir_path = os.path.join(base_dir, directory)
        if os.path.exists(dir_path):
            print(f"\nProcessing {directory}...")
            count = process_directory(dir_path)
            total_updated += count
            print(f"  Updated {count} files in {directory}")
    
    print(f"\n✅ Total files updated: {total_updated}")

if __name__ == "__main__":
    main()