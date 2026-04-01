import { Skeleton } from '../../components/Skeleton';

function CardSkel() {
  return (
    <div className="border-2 border-kore-border rounded-lg p-3 w-[180px] flex flex-col items-center gap-2">
      <Skeleton className="w-10 h-10 rounded-full" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-3 w-16 rounded-full" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function OrgchartSkeleton() {
  return (
    <div className="flex flex-col items-center gap-0 py-8">
      {/* Root card */}
      <CardSkel />

      {/* Line down */}
      <Skeleton className="w-px h-8" />

      {/* Second level */}
      <div className="flex gap-10">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex flex-col items-center">
            <Skeleton className="w-px h-6" />
            <CardSkel />
          </div>
        ))}
      </div>

      {/* Third level preview */}
      <Skeleton className="w-px h-8 mt-2" />
      <div className="flex gap-8">
        {[1, 2].map((n) => (
          <div key={n} className="flex flex-col items-center">
            <Skeleton className="w-px h-6" />
            <div className="border-2 border-kore-border rounded-lg p-3 w-[160px] flex flex-col items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-2.5 w-14 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
