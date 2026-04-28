import os
import re

def process():
    controllers_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src', 'modules')
    for root, dirs, files in os.walk(controllers_dir):
        for file in files:
            if file.endswith('.controller.ts'):
                path = os.path.join(root, file)
                with open(path, 'r') as f:
                    content = f.read()
                
                original = content

                if "handleApiError" not in content:
                    lines = content.split('\n')
                    last_import_idx = -1
                    for idx, line in enumerate(lines):
                        if line.startswith('import '):
                            last_import_idx = idx
                    
                    import_stmt = "import { handleApiError } from '../../utils/errorHandler.js';"
                    if last_import_idx != -1:
                        lines.insert(last_import_idx + 1, import_stmt)
                    else:
                        lines.insert(0, import_stmt)
                    
                    content = '\n'.join(lines)

                # Now line by line string replace
                lines = content.split('\n')
                for idx, line in enumerate(lines):
                    if 'res.status' in line and ('.message' in line or 'error' in line or 'err' in line):
                        # We only want to replace lines inside catch blocks handling errors.
                        # Look for common patterns
                        if 'error.message' in line or 'err.message' in line or 'error' in line.split(',')[-1]:
                            error_var = 'err' if 'err' in line and 'error' not in line else 'error'
                            # Ensure we don't accidentally replace a valid early return without error context
                            # Wait, an early return doesn't typically have "error.message" unless it's logging an error.
                            if 'error.message' in line or 'err.message' in line or '(res, error)' in line:
                                leading_spaces = len(line) - len(line.lstrip())
                                lines[idx] = (' ' * leading_spaces) + f'return handleApiError(res, {error_var});'
                
                content = '\n'.join(lines)

                # Custom handling for VehicleStockInwardController special error
                content = content.replace("res.status(409).json({\n                    success: false,\n                    message: error.message,\n                    isDuplicate: true\n                });", "return handleApiError(res, error);")

                if content != original:
                    with open(path, 'w') as f:
                        f.write(content)
                    print(f"Updated: {file}")

if __name__ == '__main__':
    process()
