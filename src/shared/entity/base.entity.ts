import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
    @CreateDateColumn({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    public created_at: Date;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    public updated_at: Date;

    @Column({ type: 'boolean', default: false, nullable: true })
    deleted: boolean;

    @Column({ type: 'timestamp with time zone', nullable: true })
    deleted_at: Date;
}
