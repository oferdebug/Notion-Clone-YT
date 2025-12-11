'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  useOthers,
  useSelf,
} from '@liveblocks/react/suspense';

export default function ActiveUsers() {
    const others = useOthers();
    const self = useSelf();
    

    const allUsers = [self, ...others];
    return (
        <div className='flex items-center gap-2'>
            <div className='flex -space-x-2'>
            {allUsers.slice(0, 4).map((user, index) => {
                if (!user?.info) return null;

                const name = user.info.name || 'Anonymous';
                const avatar = user.info.avatar;
                const initials = name.split('').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
                
                return(
                    <Avatar
                        key={user.connectionId || index}
                        className="border-2 border-background w-8 h-8 hover:z-10 transition-all hover:scale-110"
                        title={name}
                    >
                        {avatar && <AvatarImage src={avatar} alt={name} />}
                        <AvatarFallback className='text-xs bg-primary text-white'>
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                );
            })}
            </div>
            {allUsers.length > 4 && (
                <span className='text-xs text-muted-foreground'>
                    +{allUsers.length - 4} more
                </span>
            )};
        </div>
    );
}


