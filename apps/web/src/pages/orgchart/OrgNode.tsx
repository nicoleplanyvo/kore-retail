import { useState, useCallback } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { OrgTreeNode } from './types';
import { OrgCard } from './OrgCard';
import { countDescendants } from './buildTree';

interface OrgNodeProps {
  readonly node: OrgTreeNode;
  readonly isEditMode: boolean;
  readonly onAssignManager: (userId: string) => void;
  readonly selectedUserId?: string | null;
}

export function OrgNode({ node, isEditMode, onAssignManager, selectedUserId }: OrgNodeProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const hasChildren = node.children.length > 0;
  const descendantCount = hasChildren ? countDescendants(node) : 0;

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Node card */}
      <div className="relative">
        <OrgCard
          user={node.user}
          isEditMode={isEditMode}
          onAssignManager={onAssignManager}
          isSelected={selectedUserId === node.user.id}
        />

        {/* Collapse toggle */}
        {hasChildren && (
          <button
            onClick={toggleCollapse}
            className="
              absolute -bottom-3 left-1/2 -translate-x-1/2 z-10
              w-6 h-6 rounded-full bg-white border-2 border-kore-border
              flex items-center justify-center
              hover:bg-kore-surface hover:border-kore-mid/40
              transition-colors shadow-sm
            "
            aria-label={isCollapsed ? 'Aufklappen' : 'Zuklappen'}
            title={
              isCollapsed
                ? `${descendantCount} Mitarbeiter anzeigen`
                : 'Zuklappen'
            }
          >
            {isCollapsed ? (
              <ChevronRight size={12} className="text-kore-mid" />
            ) : (
              <ChevronDown size={12} className="text-kore-mid" />
            )}
          </button>
        )}
      </div>

      {/* Collapsed indicator */}
      {hasChildren && isCollapsed && (
        <div className="mt-4 text-[0.65rem] text-kore-mid bg-kore-surface/60 px-2.5 py-1 rounded-full">
          {descendantCount} {descendantCount === 1 ? 'Mitarbeiter' : 'Mitarbeiter'}
        </div>
      )}

      {/* Children branch */}
      {hasChildren && !isCollapsed && (
        <>
          {/* Vertical line from parent down to connector */}
          <div className="w-px h-8 bg-kore-border" />

          {/* Children container */}
          <div className="relative flex">
            {/* Horizontal connector line spanning all children */}
            {node.children.length > 1 && (
              <div
                className="absolute top-0 h-px bg-kore-border"
                style={{
                  left: `${100 / (2 * node.children.length)}%`,
                  right: `${100 / (2 * node.children.length)}%`,
                }}
              />
            )}

            {node.children.map((child) => (
              <div key={child.user.id} className="flex flex-col items-center px-3">
                {/* Vertical line from horizontal connector down to child */}
                <div className="w-px h-6 bg-kore-border" />

                <OrgNode
                  node={child}
                  isEditMode={isEditMode}
                  onAssignManager={onAssignManager}
                  selectedUserId={selectedUserId}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
