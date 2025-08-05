# Shared Navigation System

This system allows you to maintain a consistent navigation header across all pages using a single JavaScript file.

## How It Works

The `shared-navigation.js` file contains:
- The complete navigation HTML structure
- Automatic active page detection
- Functions to create and manage the navigation

## How to Use

### 1. Add the Script to Your HTML Page

Add this line to the `<head>` section of any page where you want the shared navigation:

```html
<script defer src="shared-navigation.js"></script>
```

### 2. Remove Existing Navigation HTML

Remove any existing navigation HTML from your page. The shared navigation will be automatically inserted at the beginning of the `<body>`.

### 3. Keep the CSS Styles

Make sure your page includes the navigation CSS styles (either in `main.css` or inline). The shared navigation uses these CSS classes:
- `.main-navigation`
- `.nav-container`
- `.nav-logo`
- `.nav-menu`
- `.nav-item`
- `.nav-link`
- `.nav-link.active`
- `.pwa-install-button`

## Automatic Active Page Detection

The shared navigation automatically detects which page is currently active and highlights the correct navigation item. It works with:

- `index.html` → HOME
- `CP2388-worksheets.html` → CP2388
- `tracking-dashboard.html` → PROGRESS
- `about.html` → ABOUT
- Any `worksheet-*.html` → CP2388 (automatically)

## Example Implementation

Here's how to implement it on a new page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Page Title</title>
  <link rel="stylesheet" href="main.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <!-- Add the shared navigation script -->
  <script defer src="shared-navigation.js"></script>
</head>
<body>
  <!-- Your page content here -->
  <!-- The navigation will be automatically inserted at the top -->
  
  <div class="main-container">
    <h1>Your Page Content</h1>
    <!-- Rest of your content -->
  </div>
</body>
</html>
```

## Benefits

1. **Consistency**: All pages have identical navigation
2. **Maintainability**: Update navigation in one place
3. **Automatic Active State**: No need to manually set active classes
4. **Easy Implementation**: Just add one script tag
5. **Future-Proof**: Easy to add new navigation items

## Files Updated

- ✅ `index.html` - Now uses shared navigation
- ✅ `CP2388-worksheets.html` - Now uses shared navigation
- 🔄 Other pages can be updated similarly

## Next Steps

To complete the implementation, update the remaining pages:
- `about.html`
- `tracking-dashboard.html`
- All worksheet pages (`worksheet-1.html`, `worksheet-2.html`, etc.)

Just add `<script defer src="shared-navigation.js"></script>` to each page and remove their existing navigation HTML. 