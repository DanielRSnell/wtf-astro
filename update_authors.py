#!/usr/bin/env python3
import os
import re
from pathlib import Path

def update_author_in_file(file_path):
    """Update author to Daniel Snell in a single MDX file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if metadata section has author field
    if 'author:' in content:
        # Replace any existing author with Daniel Snell
        content = re.sub(
            r'author:\s*"[^"]*"',
            'author: "Daniel Snell"',
            content
        )
        print(f"✓ Updated author in {file_path.name}")
    else:
        # If no author field exists, we need to add it to metadata
        # Find the metadata section and add author field
        metadata_match = re.search(r'metadata:\s*{([^}]+)}', content, re.DOTALL)
        if metadata_match:
            metadata_content = metadata_match.group(1)
            # Add author field to metadata
            if 'author:' not in metadata_content:
                updated_metadata = metadata_content.rstrip() + '\n  author: "Daniel Snell"'
                content = content.replace(
                    f'metadata: {{{metadata_content}}}',
                    f'metadata: {{{updated_metadata}}}'
                )
                print(f"✓ Added author to metadata in {file_path.name}")
        else:
            print(f"⚠ No metadata section found in {file_path.name}")
    
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
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
        if update_author_in_file(file_path):
            success_count += 1
    
    print(f"\n✅ Successfully updated authors in {success_count}/{len(mdx_files)} files")

if __name__ == "__main__":
    main()